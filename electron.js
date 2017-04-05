'use strict';

let electron = require('electron');
let app = electron.app;
let BrowserWindow = electron.BrowserWindow;

let mainWindow = null;

app.on('ready', ()=>{
    mainWindow = new BrowserWindow({width: 960, height: 540});
    mainWindow.loadURL(`file://${__dirname}/public/index.html`);
});
