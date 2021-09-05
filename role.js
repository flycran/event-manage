const { ipcMain, webContents, BrowserWindow } = require('electron')

ipcMain.on({
   'key-toggledevtools'() {
      webContents.getFocusedWebContents().toggleDevTools()
   },
   'key-windowReload'() {
      webContents.getFocusedWebContents().reload()
   },
   'key-maximize'() {
      BrowserWindow.getFocusedWindow().maximize()
   },
   'key-unmaximize'() {
      BrowserWindow.getFocusedWindow().unmaximize()
   },
})