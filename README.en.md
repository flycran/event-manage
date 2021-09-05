# event manage

### introduce
A shortcut key management program for Electron applications. Support static configuration events, dynamic modification configuration, binding shortcut keys, input shortcut keys and other one-stop shortcuts and event solutions.
Depends on Electron operation.

### Installation tutorial

`npm i event-manage`

### Instructions for use
Used in the rendering process of Electron
```js
   const { ipcRenderer } = require('electron')
   const { init, searchKey, searchKeyWord, MonitorKeys, modifyKey } = require('event-manage')
   init({
      window,
      config: [
         {
            name: 'Unselect all',
            command: 'UnselectAll',
            key:'ctrl+shift+alt+a'
         }
      ]
   })
```
#### configOption Supported attributes 
| Attributes | describe                        |
| ---------- | ------------------------------- |
| name       | Displayed name                  |
| command    | Command name, unique identifier |
| key        | Shortcut key string             |
| role       | System instructions             |
| event      | Event function                  |

#### role
Using events quickly to call system events will override the event attribute to make it invalid.

To make it effective, the `role.js` file must be introduced in the main process

Write `require('event-manage/role')` in the head of the main process.
| role           | describe                   |
| -------------- | -------------------------- |
| toggledevtools | Switch console             |
| windowReload   | Refresh the current window |