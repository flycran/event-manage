interface configOption {
   name: string
   command: string
   key?: string
   event?(): any
   role?: string
}

interface initOption {
   config: configOption[]
}

/**
 * 初始化按键
 * @param {object} option 配置项
 */
export function init(initOption): void
/**
 * 按configOption.name和configOption.command搜索键
 * @param {string} keyWord 
 */
export function searchKeyWord(keyWord: string): Array<configOption>
/**
 * 按configOption.key搜索键
 * @param {string} key 
 */
export function searchKey(key: string): Array<configOption>
/**
 * 修改键
 * @param {string} command 执行的命令
 * @param {string} newKey 绑定的按键
 * @param {string} key 原绑定的按键
 */
export function modifyKey(command: string, newKey: string, key?: string): boolean
/**
 * 
 * @param {(key:string) => any} callback 录入按键时执行的回调函数时
 * @returns {Promise<string>} 返回Promise对象，当用户敲下回车时传入录入的按键，当用户敲下Esc时传入flase
 */
export function monitorKeys(callback: (keyStr, modifier, character) => any): Promise<string>