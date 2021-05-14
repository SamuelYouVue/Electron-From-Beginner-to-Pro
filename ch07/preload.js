const ipc = require("electron").ipcRenderer;

window.addEventListener("DOMContentLoaded", () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element) element.innerText = text;
    };

    for (const type of["chrome", "node", "electron"]) {
        replaceText(`${type}-version`, process.versions[type]);
    }

    const selectDirBtn = document.getElementById("select-directory");
    selectDirBtn.addEventListener("click", function(event) {
        ipc.send("open-directory-dialog");
    });

    const selectFileBtn = document.getElementById("select-file");
    selectFileBtn.addEventListener("click", function(event) {
        ipc.send("open-file-dialog");
    });

    const infoDialogBtn = document.getElementById("info");
    const errorDialogBtn = document.getElementById("error");
    const questionDialogBtn = document.getElementById("question");
    const noneDialogBtn = document.getElementById("none");
    infoDialogBtn.addEventListener("click", function(event) {
        ipc.send("display-dialog", "info");
    });
    errorDialogBtn.addEventListener("click", function(event) {
        ipc.send("display-dialog", "error");
    });
    questionDialogBtn.addEventListener("click", function(event) {
        ipc.send("display-dialog", "question");
    });
    noneDialogBtn.addEventListener("click", function(event) {
        ipc.send("display-dialog", "none");
    });
});

ipc.on("selectedItem", function(event, path) {
    console.log(path);
    document.getElementById("selectedItem").innerHTML = `You selected: ${path}`;
});