# 事件管理

### 介绍
适用于Electron应用的快捷键管理程序。支持静态配置事件、动态修改配置、绑定快捷键、录入快捷键等一站式快捷键与事件的解决方案。
依赖于Electron运行。

### 安装教程

`npm i event-manage`

### 使用说明
在Electron的渲染进程中使用
```js
   const { ipcRenderer } = require('electron')
   const { init, searchKey, searchKeyWord, MonitorKeys, modifyKey } = require('event-manage')
   init({
      window,
      config: [
         {
            name: '取消全选',
            command: 'UnselectAll',
            key:'ctrl+shift+alt+a'
         }
      ]
   })
```
#### configOption 支持的属性
| 属性    | 描述               |
| ------- | ------------------ |
| name    | 显示的名称         |
| command | 指令名，唯一标识符 |
| key     | 快捷键字符串       |
| role    | 系统指令           |
| event   | 事件函数           |

#### role
将事件快速用于调用系统事件，将会覆盖event属性使其失效。
要使其生效，必须在主进程引入`role.js`文件
在主进程头部写入`require('event-manage/role')`即可。
| role           | 描述         |
| -------------- | ------------ |
| toggledevtools | 切换控制台   |
| windowReload   | 刷新当前窗口 |
