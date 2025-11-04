function removeCollectionsHeader() {
    const collectionHeader = document.querySelector(
        '[aria-labelledby="popular-collections-header"]',
    );
    collectionHeader?.remove();
}

window.addEventListener("urlchange", removeCollectionsHeader);

removeCollectionsHeader();
