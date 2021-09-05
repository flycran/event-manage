const { ipcMain, webContents } = require('electron')

ipcMain.on({
   'key-toggledevtools'() {
      webContents.getFocusedWebContents().toggleDevTools()
   },
   'key-windowReload'() {
      webContents.getFocusedWebContents().reload()
   }
})