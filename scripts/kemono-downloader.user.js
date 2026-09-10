// ==UserScript==
// @name        Kemono Downloader
// @description Download images and attachments from posts on Kemono, Coomer, and Pawchive
// @namespace   kemono
// @version     2.2.2
// @match       *://kemono.cr/*
// @match       *://coomer.st/*
// @match       *://pawchive.st/*
// @match       *://pawchive.pw/*
// @iconURL     https://www.google.com/s2/favicons?sz=64&domain=kemono.party
// @run-at      document-start
// @noframes
// @downloadURL https://github.com/FutonArizona/userscripts/raw/master/scripts/kemono-downloader.user.js
// @updateURL   https://github.com/FutonArizona/userscripts/raw/master/scripts/kemono-downloader.user.js
// @grant       window.onurlchange
// @grant       GM_download
// @grant       GM_notification
// ==/UserScript==

class o{files;downloadedFiles;failedFiles;downloadButton;postAPI;constructor(o){this.files=[],this.downloadedFiles=[],this.failedFiles=[],this.postAPI=o.origin+"/api/v1"+o.pathname}}let t=new o(document.location);async function e(){let o;try{o=await async function(){const o=await fetch(t.postAPI);if(!o.ok)throw new Error("Error getting post");return await o.json()}()}catch(o){return console.error("Error getting post",o),void GM_notification({text:"ERROR: Failed to get post data",timeout:0})}if(console.log("Got post:",{post:o}),t.files=function(o){const t={},e=location.protocol+"//file."+location.host+"/data"+o.file.path;t[e]=o.file.name;for(const e of o.attachments??[]){t[(e.server??location.protocol+"//file."+location.host)+"/data"+e.path]=e.name}for(const e of o.previews??[]){if("thumbnail"!==e.type)continue;t[e.server+"/data"+e.path]=e.name}const n=[];for(const[o,e]of Object.entries(t))n.push({URL:o,Name:e});return n}(o),t.files.length){if(console.log("Got files:",{files:t.files}),t.downloadButton=await async function(){let o;for(;!o;o=document.getElementsByClassName("post__body")[0])await a(100);const e=document.createElement("button");return e.textContent=`Download ${t.files.length} Files`,e.id="kemono-download-button",e.style.position="relative",e.style.float="right",e.addEventListener("click",l),o.insertBefore(e,o.firstChild)}(),!t.downloadButton)return console.error("Failed to create download button"),void GM_notification({text:"ERROR: Failed to create download button",timeout:0});console.log("Created download button",{downloadButton:t.downloadButton})}else console.log("No files in post. Exiting")}function n(){t.downloadButton?t.downloadButton.textContent=t.downloadButton.disabled?`Downloading Files... ${t.downloadedFiles.length}/${t.files.length}`:`Download ${t.files.length} Files`:console.error("Download button is undefined")}async function l(){if(t.downloadButton){t.downloadButton.disabled=!0,n();for(const o of t.files)i(o);for(;t.downloadedFiles.length+t.failedFiles.length<t.files.length;)await a(500);console.log("Download Complete",{downloadedFiles:t.downloadedFiles,failedFiles:t.failedFiles}),GM_notification({text:`Download Complete:\nSuccess Count: ${t.downloadedFiles.length}\nFailure Count: ${t.failedFiles.length}`,timeout:5e3}),t.downloadedFiles=[],t.failedFiles=[],t.downloadButton.disabled=!1,n()}else console.error("Download button is undefined")}async function i(o,e=0){e>3?t.failedFiles.push(o):(await a(e**2*1e3),GM_download({url:o.URL,name:o.Name,onerror:()=>i(o,e+1),onload:()=>{t.downloadedFiles.push(o),n()}}))}function a(o){return new Promise(t=>{setTimeout(t,o)})}async function d(){t.downloadButton?.remove();const n=document.location.pathname.match(/\/user\/[a-zA-Z0-9_]+\/post\/\d+/);n?.length&&(t=new o(document.location),await e())}window.addEventListener("urlchange",async()=>{await d()}),async function(){await d()}();
