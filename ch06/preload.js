const { remote, ipcRenderer: ipc } = require("electron");

window.onload = function() {
    const syncMsgBtn = document.getElementById("sendSyncMsgBtn");

    syncMsgBtn.addEventListener("click", function() {
        const reply = ipc.sendSync("synchronous-message", "Mr. Watson, come here.");
        console.log(reply);
        const message = `Synchronous message reply: ${reply}`;
        document.getElementById("syncReply").innerHTML = message;
    });

    const asyncMsgBtn = document.getElementById("sendAsyncMsgBtn");
    asyncMsgBtn.addEventListener("click", function() {
        ipc.send("asynchronous-message", `That's one small step for man`);
    });
};

ipc.on("asynchronous-reply", function(event, arg) {
    const message = `Asynchronous message reply: ${arg}`;
    document.getElementById("asyncReply").innerHTML = message;
});

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