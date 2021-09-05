const { ipcRenderer } = require('electron')
const SHIFT_MAP = {
   '~': '`',
   '!': '1',
   '@': '2',
   '#': '3',
   '$': '4',
   '%': '5',
   '^': '6',
   '&': '7',
   '*': '8',
   '(': '9',
   ')': '0',
   '_': '-',
   '+': '=',
   '{': '[',
   '}': ']',
   ':': ';',
   '\"': '\'',
   '<': ',',
   '>': '.',
   '?': '/',
   '|': '\\'
};
const MODIFIER_MAP = {
   'Control': 'ctrl',
   'Alt': 'alt',
   'Shift': 'shift',
}
/**
 * 
 * @param {string} key 
 * @returns 
 */
function mapKey(key) {
   const k = SHIFT_MAP[key]
   return k || key.toLowerCase()
}
const ROLE = {
   toggledevtools() {
      ipcRenderer.send('key-toggledevtools')
   },
   windowReload() {
      ipcRenderer.send('key-windowReload')
   },
   maximize() {
      ipcRenderer.send('key-maximize')
   },
   unmaximize() {
      ipcRenderer.send('key-unmaximize')
   },
}
let WINDOW
/**
 * 储存command的索引器
 * @type {Map<string, configOption>}
 */
const COMMAND_INDEX = new Map
/**
 * 储存key的索引器
 * @type {Map<string, Set>}
 */
const KEY_INDEX = new Map

module.exports.init = function ({
   config,
   window
}) {
   if (!window) return
   WINDOW = window
   /**
    * 在指定command索引添加事件
    * @param {object} option 
    */
   function addCommand(option) {
      COMMAND_INDEX.set(option.command, option)
      const KEY = KEY_INDEX.get(option.key)
      if (option.role) option.event = ROLE[option.role]
      if (KEY) KEY.add(option.command)
      else KEY_INDEX.set(option.key, new Set([option.command]))
   }
   /**
    * @type {object[]}
    */
   const keyConfig = config
   keyConfig.forEach(a => {
      addCommand(a)
   })
   window.addEventListener('keydown', (event) => {
      let character = event.key
      const MOD = MODIFIER_MAP[character]
      if (MOD) return
      character = mapKey(character) || character
      const MODIFIER = [];
      (event.ctrlKey || event.mecaKey) && (MODIFIER.push('ctrl'))
      event.shiftKey && (MODIFIER.push('shift'))
      event.altKey && (MODIFIER.push('alt'))
      const MODIFIERS = MODIFIER.join('+')
      const KEY = KEY_INDEX.get(MODIFIERS ? MODIFIERS + '+' + character : character)
      if (KEY) KEY.forEach(a => {
         const COM = COMMAND_INDEX.get(a)
         COM.event && COM.event()
      })
   })
   return
}
module.exports.searchKeyWord = function (keyWord) {
   const result = []
   COMMAND_INDEX.forEach(a => {
      const N = a.name && a.name.includes(keyWord)
      const M = a.command && a.command.includes(keyWord)
      if (N || M) result.push(a)
   })
   return result
}
module.exports.searchKey = function (key) {
   const result = []
   COMMAND_INDEX.forEach(a => { a.key.includes(key) && result.push(a) })
   return result
}
/**
 * 修改按键
 * @param {string} command 
 * @param {string} newKey 
 * @param {string} key 
 * @returns 
 */
module.exports.modifyKey = function (command, newKey, key) {
   if (!key) key = COMMAND_INDEX.get(command).key
   if (!newKey || newKey === key) return false
   const OLD_KEY = KEY_INDEX.get(key)
   OLD_KEY.delete(command)
   COMMAND_INDEX.get(command).key = newKey
   if (!OLD_KEY.size) delete KEY_INDEX[key]
   const KEY = KEY_INDEX[newKey]
   if (KEY) KEY.add(command)
   else KEY_INDEX.set(newKey, new Set([command]))
   console.log(KEY_INDEX);
   return true
}
/**
 * 监视键盘
 * @param {(modifier:string, character:string)=>any} callback 
 * @returns {Promise}
 */
module.exports.MonitorKeys = function (callback) {
   return new Promise((resolve) => {
      let keyStr, key
      function listener(event) {
         let zkey = event.key
         const M = MODIFIER_MAP[zkey]
         zkey = M || mapKey(zkey) || zkey
         if (zkey === key) return
         key = zkey
         if (key === 'Enter' || key === 'Esc') {
            WINDOW.removeEventListener('keydown', listener)
            WINDOW.removeEventListener('keyup', listenerUp)
            resolve(key === 'Esc' ? false : KEY)
            return
         }
         const MODIFIER = [];
         (event.ctrlKey || event.mecaKey) && (MODIFIER.push('ctrl'))
         event.shiftKey && (MODIFIER.push('shift'))
         event.altKey && (MODIFIER.push('alt'))
         const MODIFIERS = MODIFIER.join('+')
         keyStr = M ? MODIFIERS : MODIFIERS ? MODIFIERS + '+' + key : key
         callback(keyStr)
      }
      function listenerUp() {
         key = undefined
      }
      WINDOW.addEventListener('keydown', listener)
      WINDOW.addEventListener('keyup', listenerUp)
   })
}