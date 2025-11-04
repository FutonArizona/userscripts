// ==UserScript==
// @name        Nexus Mods Collections Remover
// @description Deletes the 'Collections' header from the Nexus Mods homepage
// @namespace   nexusmods
// @version     1.0.0
// @match       *://*.nexusmods.com/*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=nexusmods.com
// @run-at      document-start
// @downloadURL https://github.com/FutonArizona/userscripts/raw/master/scripts/nexusmods-collections-remover.user.js
// @updateURL   https://github.com/FutonArizona/userscripts/raw/master/scripts/nexusmods-collections-remover.user.js
// @grant       window.onurlchange
// ==/UserScript==

function removeCollectionsHeader() {
    const collectionHeader = document.querySelector(
        '[aria-labelledby="popular-collections-header"]',
    );
    collectionHeader?.remove();
}

window.addEventListener("urlchange", removeCollectionsHeader);

removeCollectionsHeader();
