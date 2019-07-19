const { app, BrowserWindow, globalShortcut,ipcMain, dialog} = require('electron')
const os = require("os");
const path = require('path');
const childProcess = require('child_process');

// const argStr = process.argv.join('').toLowerCase()
// const isDevelopment = argStr.indexOf('development');
// console.log({isDevelopment});

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            devTools: true,
            plugins: true
        },
        // frame: false //设置窗口无边框，包括菜单栏关闭按钮都将隐藏
    })
    mainWindow.loadFile('index.html')

    mainWindow.webContents.openDevTools()

    mainWindow.on('closed', function () {
        mainWindow = null
    })

    // mainWindow.webContents.on('will-prevent-unload', ev => {
    //     const choice = dialog.showMessageBox(mainWindow, {
    //         type: 'question',
    //         message: 'Leave Scratch?',
    //         detail: 'Any unsaved changes will be lost.',
    //         buttons: ['Stay', 'Leave'],
    //         cancelId: 0, // closing the dialog means "stay"
    //         defaultId: 0 // pressing enter or space without explicitly selecting something means "stay"
    //     });
    //     const shouldQuit = (choice === 1);
    //     if (shouldQuit) {
    //         ev.preventDefault();
    //     }
    // });


    // 注册一个 'CommandOrControl+X' 的全局快捷键
    const ret = globalShortcut.register('CommandOrControl+X', () => {
        console.log('CommandOrControl+X is pressed');
        if(mainWindow.isFocused()){
            app.quit(); // ctrl + x:  退出程序  
        }
    })

    if (!ret) {
        console.log('registration failed')
    }

    
}

//接受渲染进程消息，开关devTools
ipcMain.on('toggle-devTools', (event, argv)=>{
    console.log(argv);
    mainWindow.webContents.isDevToolsOpened ? mainWindow.webContents.closeDevTools() : mainWindow.webContents.openDevTools();
})

app.on('ready', createWindow)

app.on('window-all-closed', function () {
    app.quit()
})

app.on('activate', function () {

})

app.on('browser-window-created', function(event, browserWindow){
    let title = browserWindow.webContents.getTitle()
    browserWindow.webContents.on('will-prevent-unload', ev => {
        const choice = dialog.showMessageBox(browserWindow, {
            type: 'question',
            message: `是否关闭当前窗口?`,
            detail: '未保存的更改将会丢失',
            buttons: ['取消', '关闭'],
            cancelId: 0, // closing the dialog means "stay"
            defaultId: 0 // pressing enter or space without explicitly selecting something means "stay"
        });
        const shouldQuit = (choice === 1);
        if (shouldQuit) {
            ev.preventDefault();
        }
    });
})

app.on('web-contents-created', function(e, webContents){
    
})

