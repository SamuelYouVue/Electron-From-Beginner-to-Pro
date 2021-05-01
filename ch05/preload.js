const { remote, ipcRenderer } = require("electron");
const ipc = ipcRenderer;

window.addEventListener("contextmenu", (event) => {
    event.preventDefault();
    ipc.send("show-context-menu");
});

window.addEventListener("DOMContentLoaded", () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element) element.innerText = text;
    };

    for (const type of["chrome", "node", "electron"]) {
        replaceText(`${type}-version`, process.versions[type]);
    }
});