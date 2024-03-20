const electron = require('electron');
const path = require('path');

const {
    app, // 控制应用生命周期的模块
    BrowserWindow, // 创建原生浏览器窗口的模块
} = electron;

// 保持一个对于 window 对象的全局引用，如果不这样做，
// 当 JavaScript 对象被垃圾回收， window 会被自动地关闭
let mainWindow;

const winUrl = path.resolve(__dirname, "index.html")
function createWindow() {
    // 创建浏览器窗口。
    mainWindow = new BrowserWindow({
        width: 800, height: 600,
        frame: false,
        icon: path.resolve(__dirname, "./public/favicon.ico"),
        titleBarStyle: 'hidden',
        titleBarOverlay: {
            // 控制按钮区域背景颜色（CSS 颜色） （仅 Windows）
            color: 'rgba(255,255,255,0)',
            //控制按钮高度（单位 px）。不宜太小，这里设置为 35 是比较合适的。（Windows、MacOS）
            height: 35,
            // 控制按钮颜色（CSS 颜色）。如果你想要暗色背景，那么这里应该设置为亮色，反之亦然。（仅 Windows）
            symbolColor: 'black'
        }
    });

    if(app.isPackaged) {
        // 入口html
        mainWindow.loadURL(`file://${winUrl}`)
    }else {
        // 执行当前启动的web应用
        mainWindow.loadURL(" http://localhost:5173/");
        mainWindow.webContents.openDevTools()
    }

    // 当 window 被关闭，这个事件会被触发。
    mainWindow.on('closed', () => {
        // 取消引用 window 对象，如果你的应用支持多窗口的话，
        // 通常会把多个 window 对象存放在一个数组里面，
        // 与此同时，你应该删除相应的元素。
        mainWindow = null;
    });

    // 在窗口准备完全显示并可以被用户看到时触发
    mainWindow.on("ready-to-show", () => {mainWindow.show()})

    return mainWindow
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow);

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // 在 macOS 上，当点击 dock 图标并且该应用没有打开的窗口时，
    // 绝大部分应用会重新创建一个窗口。
    if (mainWindow === null) {
        createWindow();
    }
});

app.on("quit", () => {
    // 释放所有的单例锁
    app.releaseSingleInstanceLock()
})