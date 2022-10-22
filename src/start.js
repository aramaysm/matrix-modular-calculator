const electron = require('electron')
const app = electron.app


const isDev = require('electron-is-dev')
const BrowserWindow = electron.BrowserWindow

const path = require('path')

let mainWindow

function createWindow() {
  mainWindow = new BrowserWindow({ 
    width: 800, 
    height: 600,
    //frame: false, 
})

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`,
  )
  mainWindow.on('closed', () => {
    mainWindow = null
  })
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

//"build": "electron-packager .  --platform=win32 --arch=x64 --app-version=1.0.0 --ignores=node_modules/electron-* Matrix-Calculator-V1 ",
   