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
    // Open the DevTools.
    //win.webContents.openDevTools();

    // Wait for 'ready-to-show' to display our window
    win.once("ready-to-show", () => {
        win.show();
    });

    // Emitted when the window is closed.
    win.on("closed", function() {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null;
        console.log("closed");
    });
}

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