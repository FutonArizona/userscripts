/**
 * @typedef {object} KemonoFile
 * @property {string} URL the file download URL
 * @property {string} Name the file name
 */

class KemonoDownloader {
    /** @type {Array<KemonoFile>} */
    files;

    /** @type {Array<KemonoFile>} */
    downloadedFiles;

    /** @type {Array<KemonoFile>} */
    failedFiles;

    /** @type {HTMLButtonElement | undefined} */
    downloadButton;

    /** @type {string} */
    postAPI;

    /**
     * Create a new KemonoDownloader object
     * @param {Location} location the document location
     */
    constructor(location) {
        this.files = [];
        this.downloadedFiles = [];
        this.failedFiles = [];
        this.postAPI = location.origin + "/api/v1" + location.pathname;
    }
}

let downloader = new KemonoDownloader(document.location);

async function main() {
    /** @type {Kemono.GetPostResponse} */
    let post;
    try {
        post = await getPost();
    } catch (err) {
        console.error("Error getting post", err);
        GM_notification({ text: "ERROR: Failed to get post data", timeout: 0 });
        return;
    }
    console.log("Got post:", { post });

    downloader.files = extractFilesFromPost(post);
    if (!downloader.files.length) {
        console.log("No files in post. Exiting");
        return;
    }
    console.log("Got files:", { files: downloader.files });

    downloader.downloadButton = await createDownloadButton();
    if (!downloader.downloadButton) {
        console.error("Failed to create download button");
        GM_notification({ text: "ERROR: Failed to create download button", timeout: 0 });
        return;
    }
    console.log("Created download button", { downloadButton: downloader.downloadButton });
}

/**
 * Get the post information
 *
 * @returns the post information object
 */
async function getPost() {
    const response = await fetch(downloader.postAPI);
    if (!response.ok) {
        throw new Error("Error getting post");
    }

    return /** @type {Kemono.GetPostResponse} */ (await response.json());
}

/**
 * Extract the file names & URLs from the post body
 *
 * @param {Kemono.GetPostResponse} post the post response body
 * @returns a list of the files
 */
function extractFilesFromPost(post) {
    /** @type {Record<string, string>} */
    const fileMap = {};

    // Extract file URL & name from attachments
    for (const attachment of post.attachments) {
        const fileURL = attachment.server + "/data" + attachment.path;
        fileMap[fileURL] = attachment.name;
    }

    // Extract file URL & name from previews
    for (const preview of post.previews) {
        if (preview.type !== "thumbnail") {
            continue;
        }

        const fileURL = preview.server + "/data" + preview.path;
        fileMap[fileURL] = preview.name;
    }

    /** @type {Array<KemonoFile>} */
    const files = [];
    for (const [url, name] of Object.entries(fileMap)) {
        files.push({ URL: url, Name: name });
    }

    return files;
}

/**
 * Creates the download button with the file count and event listener
 *
 * @returns the download button element
 */
async function createDownloadButton() {
    let postBody;
    for (; !postBody; postBody = document.getElementsByClassName("post__body")[0]) {
        await wait(100);
    }

    const button = document.createElement("button");
    button.textContent = `Download ${downloader.files.length} Files`;
    button.id = "kemono-download-button";
    button.style.position = "relative";
    button.style.float = "right";

    button.addEventListener("click", handleDownloadEvent);

    return postBody.insertBefore(button, postBody.firstChild);
}

/**
 * Updates the button name according to the downloading state
 */
function updateButtonText() {
    if (!downloader.downloadButton) {
        console.error("Download button is undefined");
        return;
    }

    downloader.downloadButton.textContent =
        downloader.downloadButton.disabled ?
            `Downloading Files... ${downloader.downloadedFiles.length}/${downloader.files.length}`
        :   `Download ${downloader.files.length} Files`;
}

/**
 * Handle the download click event
 */
async function handleDownloadEvent() {
    if (!downloader.downloadButton) {
        console.error("Download button is undefined");
        return;
    }

    downloader.downloadButton.disabled = true;
    updateButtonText();

    for (const file of downloader.files) {
        downloadFile(file);
    }

    while (
        downloader.downloadedFiles.length + downloader.failedFiles.length <
        downloader.files.length
    ) {
        await wait(500);
    }

    console.log("Download Complete", {
        downloadedFiles: downloader.downloadedFiles,
        failedFiles: downloader.failedFiles,
    });
    GM_notification({
        text: `Download Complete:\nSuccess Count: ${downloader.downloadedFiles.length}\nFailure Count: ${downloader.failedFiles.length}`,
        timeout: 5_000,
    });

    downloader.downloadedFiles = [];
    downloader.failedFiles = [];

    downloader.downloadButton.disabled = false;
    updateButtonText();
}

/**
 * Download a file
 * @param {KemonoFile} file
 * @param {number=} retryCount
 */
async function downloadFile(file, retryCount = 0) {
    if (retryCount > 3) {
        downloader.failedFiles.push(file);
        return;
    }

    await wait(retryCount ** 2 * 1_000);

    GM_download({
        url: file.URL,
        name: file.Name,
        onerror: () => downloadFile(file, retryCount + 1),
        onload: () => {
            downloader.downloadedFiles.push(file);
            updateButtonText();
        },
    });
}

/**
 * Waits for a specific number of milliseconds
 * @param {number} ms - the number of milliseconds to wait
 */
function wait(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

async function init() {
    downloader.downloadButton?.remove();
    const urlMatch = document.location.pathname.match(/\/user\/[a-zA-Z0-9_]+\/post\/\d+/);
    if (urlMatch?.length) {
        downloader = new KemonoDownloader(document.location);
        await main();
    }
}

window.addEventListener("urlchange", async () => {
    await init();
});

(async function () {
    await init();
})();
