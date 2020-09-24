// TODO: DANGER!!!
process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true";
// const spawnObj = require("child_process").spawn;
import { app, BrowserWindow, ipcMain, Tray, Menu, shell } from "electron";
import path from "path";

const PORT = 5050;

const { spawn } = require("child_process");

ipcMain.on("invokeAction", function(event, data) {
  const ls = spawn("notepad");
  console.log("ls pid: ", ls.pid);
  // const ls = spawn("ls", ["-la"]);

  // ls.stdout.on("data", (data) => {
  //   console.log(`stdout: ${data}`);
  // });

  // ls.stderr.on("data", (data) => {
  //   console.log(`stderr: ${data}`);
  // });

  ls.on("error", (error) => {
    console.log(`error: ${error.message}`);
  });

  ls.on("close", (code) => {
    console.log(`child process exited with ls.pid:  ${ls.pid}`);
  });

  // console.log("FFFFFFFFF", __dirname);
  // shell.openExternal("https://github.com");
  // console.log(path.join(__dirname, "test.txt"));
  // shell.openItem("E:\\Programming\\ELECTRON\\electro-vue\\src\\main\\test.txt");
});
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== "development") {
  global.__static = require("path")
    .join(__dirname, "/static")
    .replace(/\\/g, "\\\\");
}

let mainWindow,
  tray = null;

const winURL = process.env.NODE_ENV === "development" ? `http://localhost:9080` : `file://${__dirname}/index.html`;

function createWindow() {
  mainWindow = new BrowserWindow({
    height: 600,
    width: 1000,
    minHeight: 563,
    minWidth: 900,
    useContentSize: true,
    autoHideMenuBar: true,
    resizable: true,
    show: false,
    title: "ggg-015-44",
    icon: __dirname + "/tree.png"
  });

  mainWindow.loadURL(winURL);

  mainWindow.webContents.once("did-finish-load", function() {
    var http = require("http");
    var server = http.createServer(function(req, res) {
      console.log(req.url);
      if (req.url == "/123") {
        res.end(`ah, you send 123.`);
      } else {
        const remoteAddress = res.socket.remoteAddress;
        const remotePort = res.socket.remotePort;
        res.end(`Your IP address is ${remoteAddress} and your source port is ${remotePort}.`);
      }
    });
    server.listen(PORT);
    console.log("http://localhost:" + PORT);
  });

  // mainWindow.focus();
  mainWindow.on("closed", () => {
    console.log("===> CLOSED");
    // mainWindow = null;
    // mainWindow.hide();
    // mainWindow.setSkipTaskbar(true);
  });
  mainWindow.on("close", (event) => {
    console.log("===> CLOSE !!!");
    // event.preventDefault();
    // exitApp();
    // mainWindow.setSkipTaskbar(true);
    // mainWindow = null;
    // mainWindow.hide();
    // mainWindow.setSkipTaskbar(true);
  });

  mainWindow.on("minimize", function(event) {
    console.log("===> minimize");
    // if (tray) tray.destroy();
    event.preventDefault();
    mainWindow.setSkipTaskbar(true);
    // mainWindow.hide();
    // tray = createTray();
  });

  mainWindow.on("restore", function(event) {
    console.log("===> restore");
    mainWindow.show();
    mainWindow.setSkipTaskbar(false);
    // tray.destroy();
  });
}

app.on("ready", () => {
  console.log("===> ready!");
  createWindow();
  tray = createTray();
});

app.on("window-all-closed", (event) => {
  console.log("===> window-all-closed");
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  console.log("===> activate: ", mainWindow);
  if (mainWindow === null) {
    createWindow();
  }
});

function exitApp(trayExit = false) {
  if (trayExit) {
    console.log("trayExit: ", trayExit);
    // app.isQuiting = true;
    // app.quit();
  } else {
    console.log("trayExit: ", trayExit);
  }
}

function createTray() {
  let appIcon = new Tray(path.join(__dirname, "/tree.png"));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Show",
      click: function() {
        mainWindow.show();
      }
    },
    {
      label: "Exit",
      click: function() {
        exitApp(true);
        // app.isQuiting = true;
        // app.quit();
      }
    }
  ]);

  appIcon.on("double-click", function(event) {
    mainWindow.show();
  });
  appIcon.setToolTip("Tray Tutorial");
  appIcon.setContextMenu(contextMenu);
  return appIcon;
}

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */
