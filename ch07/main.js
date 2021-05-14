const { app, dialog, ipcMain: ipc, BrowserWindow } = require("electron");
const path = require("path");
let win = null;

ipc.on("open-directory-dialog", function(event) {
    dialog
        .showOpenDialog(win, {
            properties: ["openDirectory"],
        })
        .then((files) => {
            if (files) {
                console.log(files.filePaths);
                event.sender.send("selectedItem", files.filePaths);
            }
        });
});

ipc.on("open-file-dialog", function(event) {
    let startPath = "";
    if (process.platform === "darwin") {
        startPath = "/Users/chrisgriffith/Documents/";
    }
    dialog
        .showOpenDialog(win, {
            title: "Select a file...",
            properties: ["openFile"],
            defaultPath: startPath,
            buttonLabel: "Select...",
            filters: [{ name: "Images", extensions: ["jpg", "png", "gif"] }],
        })
        .then((files) => {
            if (files) {
                console.log(files.filePaths);
                event.sender.send("selectedItem", files.filePaths);
            }
        });
});
ipc.on("display-dialog", function(event, dialogType) {
    console.log(dialogType);
    dialog
        .showMessageBox({
            type: dialogType,
            buttons: ["Save", "Cancel", "Don't Save"],
            defaultId: 0,
            cancelId: 1,
            title: "Save Score",
            message: "Backup your score file?",
            detail: "Message detail",
        })
        .then(function(index) {
            console.log(index);
        });
});

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        backgroundColor: "#FFF",
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