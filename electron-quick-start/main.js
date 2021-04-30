const { app, BrowserWindow } = require("electron");
const path = require("path");
let win = null;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        backgroundColor: "red",
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true,
        },
    });

    win.loadFile(path.join(__dirname, "index.html"));
}

// Open the DevTools.
win.webContents.openDevTools();

win.whenReady().then(() => {
    win.show();
});

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});