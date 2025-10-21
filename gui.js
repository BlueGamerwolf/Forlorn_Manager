const { app, BrowserWindow, ipcMain } = require('electron');
const { Service } = require('node-windows');

const svc = new Service({
  name: 'Forlorn Clan Manager',
  script: 'C:\\Users\\bluem\\Forlorn_Manager\\index.js'
});

let mainWindow;

app.whenReady().then(() => {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile('index.html');
});

ipcMain.on('start-bot', () => {
  svc.start();
  mainWindow.webContents.send('bot-status', 'Starting...');
});

ipcMain.on('stop-bot', () => {
  svc.stop();
  mainWindow.webContents.send('bot-status', 'Stopping...');
});

ipcMain.on('restart-bot', () => {
  svc.once('stop', () => {
    svc.start();
    mainWindow.webContents.send('bot-status', 'Restarted');
  });

  svc.stop();
  mainWindow.webContents.send('bot-status', 'Restarting...');
});

ipcMain.on('get-status', () => {
  Service.exists('Forlorn Clan Manager', (exists) => {
    const status = exists ? 'Installed' : 'Not Installed';
    mainWindow.webContents.send('bot-status', status);
  });
});
