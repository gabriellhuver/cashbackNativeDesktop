import {
  app,
  BrowserWindow
} from 'electron'


/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
const winURL = process.env.NODE_ENV === 'development' ?
  `http://localhost:9080` :
  `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    webPreferences: {
      nodeIntegrationInWorker: true
    }
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
  mainWindow.maximize()
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// ---------- DEFAULT
var running = false;

var consoleScanner = {
  msg: "idle",
  data: null
}

const {
  ipcMain
} = require('electron')

var spawn = require('child_process').fork;

var prc = {}




ipcMain.on('status', (event, arg) => {
  event.returnValue = running
})
ipcMain.on('consoleScanner', (event, arg) => {
  event.returnValue = consoleScanner
})


ipcMain.on('running', (event, arg) => {
  consoleScanner = "Starting scan"
  if (arg) {
    prc = new spawn('./cashbackScannerApp/scanner.js')
    prc.on('close', function (code) {
      console.log('process exit code ' + code);
      consoleScanner = {
        msg: "idle",
        data: null
      }
      running = false
    });
    prc.on('error', function (code) {
      console.log('Erro on scan');
      consoleScanner = {
        msg: "idle",
        data: null
      }
      running = false
    });
    prc.on('message', function (data) {
      running = true;
      var str = data.msg.toString()
      var lines = str.split(/(\r?\n)/g);
      consoleScanner = data
      console.log(lines.join(""));
    });
  }
  if (!arg && prc != {}) {
    prc.kill()
    running = false
  }
  event.returnValue = running
})



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