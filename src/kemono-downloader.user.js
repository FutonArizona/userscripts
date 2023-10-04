// ==UserScript==
// @name         Kemono Image Downloader
// @description  Downloads all images from a post
// @namespace    kemono.party
// @version      1.0.0
// @include      /^https:\/\/kemono\.party\/(patreon|fanbox|subscribestar|gumroad|fantia)\/user\/(\d+|\w+)\/post\/[0-9A-Z]+$/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kemono.party
// @grant        GM_download
// @run-at       document-end
// ==/UserScript==

let downloadedCount = 0;
let errorCount = 0;

const replaceSpecialCharacters = function (text) {
    let newText = text;
    newText = newText.replaceAll("%20", " ");
    newText = newText.replaceAll("%23", "#");
    newText = newText.replaceAll("%26", "&");
    newText = newText.replaceAll("%28", "(");
    newText = newText.replaceAll("%29", ")");
    return newText;
};

// Get all elements with the class "post__thumbnail"
const thumbnails = document.querySelectorAll(".post__thumbnail");

const images = new Map();

// Loop through the thumbnails and add the label to each one
for (const thumbnail of thumbnails) {
    const fileAttr = thumbnail.firstElementChild;
    const downloadUrl = fileAttr.attributes.getNamedItem("href").value;
    const fileName = replaceSpecialCharacters(fileAttr.attributes.getNamedItem("download").value);

    // Create a new label element and set its text and style
    const label = document.createElement("span");
    label.textContent = fileName;
    label.style.display = "inline-block";
    label.style.position = "absolute";
    label.style.top = "0";
    label.style.left = "0";
    label.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
    label.style.color = "white";
    label.style.padding = "4px";

    // Add the label to the thumbnail element
    thumbnail.style.position = "relative";
    thumbnail.insertBefore(label, thumbnail.firstChild);

    images.set(downloadUrl, fileName);
}

const downloadImages = function () {
    const updateButton = function (increment = true) {
        const button = document.getElementById("kemono-download-button");
        if (increment) {
            downloadedCount += 1;
        }
        button.textContent = `Downloaded ${downloadedCount}/${images.size} Images${
            errorCount > 0 ? `. Errors: ${errorCount}` : ""
        }`;
    };

    const handleError = function (err, image, numRetries = 1) {
        if (err.error === "Too Many Requests" && numRetries <= 5) {
            console.log(`Too many requests on ${image.name}. Retry ${numRetries}`);
            setTimeout(
                () => {
                    // eslint-disable-next-line no-undef
                    GM_download({
                        url: image.url,
                        name: image.name,
                        onerror: (error) => handleError(error, image, (numRetries += 1)),
                        onload: updateButton,
                    });
                },
                numRetries ** 2 * 1000,
            );
        } else {
            errorCount += 1;
            console.log("Error downloading image", { err, image });
        }
    };

    updateButton(false);

    for (const image of images) {
        const imageObj = { name: image[1], url: image[0] };
        console.log(`Downloading ${imageObj.name}`);
        // eslint-disable-next-line no-undef
        GM_download({
            url: imageObj.url,
            name: imageObj.name,
            onerror: (error) => handleError(error, imageObj),
            onload: updateButton,
        });
    }

    const interval = setInterval(() => {
        if (downloadedCount + errorCount < images.size) {
            return;
        }
        clearInterval(interval);

        alert(
            `Downloaded ${downloadedCount} of ${images.size} image${
                images.size === 1 ? "" : "s"
            } with ${errorCount} error${errorCount === 1 ? "" : "s"}`,
        );
    }, 100);

    downloadedCount = 0;
    errorCount = 0;
};

// create a button element
const button = document.createElement("button");
button.textContent = `Download ${images.size} Images`; // set the text content of the button

// find the first element with class name "post__body"
const postBody = document.getElementsByClassName("post__body")[0];

// add CSS styles to the button element
button.id = "kemono-download-button";
button.style.position = "relative";
button.style.float = "right";

// add a click event listener to the button element
button.addEventListener("click", downloadImages);

// insert the button before the first child of the postBody element
postBody.insertBefore(button, postBody.firstChild);
