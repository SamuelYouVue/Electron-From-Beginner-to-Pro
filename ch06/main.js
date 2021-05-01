const {
    app,
    BrowserWindow,
    Menu,
    MenuItem,
    ipcMain: ipc,
} = require("electron");
const path = require("path");

//////
//Contextual Menu
//////
const contextMenu = new Menu();
contextMenu.append(new MenuItem({ label: "Cut", role: "cut" }));
contextMenu.append(new MenuItem({ label: "Copy", role: "copy" }));
contextMenu.append(new MenuItem({ label: "Paste", role: "paste" }));
contextMenu.append(new MenuItem({ label: "Select All", role: "selectall" }));
contextMenu.append(new MenuItem({ type: "separator" }));
contextMenu.append(
    new MenuItem({
        label: "Custom",
        click() {
            console.log("Custom Menu");
        },
    })
);
ipc.on("show-context-menu", function(event) {
    const win = BrowserWindow.fromWebContents(event.sender);
    contextMenu.popup(win);
});
ipc.on("synchronous-message", function(event, arg) {
    event.returnValue = "I heard you!";
});
ipc.on("asynchronous-message", function(event, arg) {
    if (arg === `That's one small step for man`) {
        event.sender.send("asynchronous-reply", ", one giant leap for mankind.");
    }
});

let win = null;

function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        backgroundColor: "#FFF",
        // frame: false,
        title: "Goodbye, Moon?",
        titleBarStyle: "hidden", // DEFAULT: 'default'
        // transparent: true,
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
let template = [{
        label: "Edit",
        submenu: [{
                label: "Undo",
                accelerator: "CmdOrCtrl+Z",
                role: "undo",
            },
            {
                label: "Redo",
                accelerator: "Shift+CmdOrCtrl+Z",
                role: "redo",
            },
            {
                type: "separator",
            },
            {
                label: "Cut",
                accelerator: "CmdOrCtrl+X",
                role: "cut",
            },
            {
                label: "Copy",
                accelerator: "CmdOrCtrl+C",
                role: "copy",
            },
            {
                label: "Paste",
                accelerator: "CmdOrCtrl+V",
                role: "paste",
            },
            {
                label: "Select All",
                accelerator: "CmdOrCtrl+A",
                role: "selectall",
            },
        ],
    },
    {
        label: "View",
        submenu: [{
                label: "Reload",
                accelerator: "CmdOrCtrl+R",
                click: function(item, focusedWindow) {
                    if (focusedWindow) {
                        // on reload, start fresh and close any old
                        // open secondary windows
                        if (focusedWindow.id === 1) {
                            BrowserWindow.getAllWindows().forEach(function(win) {
                                if (win.id > 1) {
                                    win.close();
                                }
                            });
                        }
                        focusedWindow.reload();
                    }
                },
            },
            {
                label: "Toggle Full Screen",
                accelerator: (function() {
                    if (process.platform === "darwin") {
                        return "Ctrl+Command+F";
                    } else {
                        return "F11";
                    }
                })(),
                click: function(item, focusedWindow) {
                    if (focusedWindow) {
                        focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
                    }
                },
            },
            {
                label: "Toggle Developer Tools",
                accelerator: (function() {
                    if (process.platform === "darwin") {
                        return "Alt+Command+I";
                    } else {
                        return "Ctrl+Shift+I";
                    }
                })(),
                click: function(item, focusedWindow) {
                    if (focusedWindow) {
                        focusedWindow.toggleDevTools();
                    }
                },
            },
        ],
    },
    {
        label: "Window",
        role: "window",
        submenu: [{
                label: "Minimize",
                accelerator: "CmdOrCtrl+M",
                role: "minimize",
            },
            {
                label: "Close",
                accelerator: "CmdOrCtrl+W",
                role: "close",
            },
            {
                type: "separator",
            },
            {
                label: "Reopen Window",
                accelerator: "CmdOrCtrl+Shift+T",
                enabled: false,
                key: "reopenMenuItem",
                click: function() {
                    app.emit("activate");
                },
            },
        ],
    },
    {
        label: "Help",
        role: "help",
        submenu: [{
            label: "Learn More",
            click: function() {
                electron.shell.openExternal("http://electron.atom.io");
            },
        }, ],
    },
];

function initialize() {
    template[2].submenu.push({
        type: "separator",
    }, {
        label: "Bring All to Front",
        role: "front",
    });
    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
    createWindow();
}

app.whenReady().then(() => {
    initialize();
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        initialize();
    }
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});