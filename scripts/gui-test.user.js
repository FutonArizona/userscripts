// ==UserScript==
// @name         button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @include      /^https:\/\/kemono\.party\/(patreon|fanbox|subscribestar|gumroad|fantia)\/user\/(\d+|\w+)\/post\/[0-9A-Z]+$/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=kemono.party
// @grant        GM_download
// ==/UserScript==

/* globals GM_download */

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
    const handleError = function (err, image, numRetries = 1) {
        if (err.error === "Too Many Requests" && numRetries <= 3) {
            console.log(`Too many requests on ${image.name}. Retry ${numRetries}`);
            setTimeout(
                () => {
                    GM_download({
                        url: image.url,
                        name: image.name,
                        onerror: (error) => handleError(error, image, (numRetries += 1)),
                    });
                },
                numRetries ** 2 * 1000,
            );
        } else {
            console.log("Error downloading image", { err, image });
        }
    };

    for (const image of images) {
        const imageObj = { name: image[1], url: image[0] };
        console.log(`Downloading ${imageObj.name}`);
        GM_download({
            url: imageObj.url,
            name: imageObj.name,
            onerror: (error) => handleError(error, imageObj),
        });
    }
};

// create a button element
const button = document.createElement("button");
button.textContent = "Download"; // set the text content of the button

// find the first element with class name "post__body"
const postBody = document.getElementsByClassName("post__body")[0];

// add CSS styles to the button element
button.style.position = "relative";
button.style.float = "right";

// add a click event listener to the button element
button.addEventListener("click", function () {
    downloadImages();
});

// insert the button before the first child of the postBody element
postBody.insertBefore(button, postBody.firstChild);
