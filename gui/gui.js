require('dotenv').config();
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { Service } = require('node-windows');
const { Client, GatewayIntentBits } = require('discord.js');

let mainWindow;
const BOT_PATH = path.join(__dirname, '..', 'src', 'index.js');

// ---------------- BOT SETUP ----------------
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.login(process.env.TOKEN);
client.once('ready', () => console.log(`✅ Logged in as ${client.user.tag}`));

function stopBot() {
  console.log('⚠️ Stopping bot...');
  client.destroy().then(() => process.exit());
}
process.on('SIGINT', stopBot);
process.on('SIGTERM', stopBot);

// ---------------- SERVICE SETUP ----------------
const svc = new Service({
  name: 'Forlorn Clan Manager',
  description: 'Manages the Forlorn Rivals Clan Discord bot',
  script: BOT_PATH,
  nodeOptions: ['--harmony', '--max_old_space_size=200'],
  wait: 2,
  grow: 0.5,
  maxRestarts: 5,
});

let restartCount = 0;
const MAX_RESTARTS = 5;

svc.on('install', () => {
  mainWindow?.webContents.send('bot-status', '✅ Service installed. Starting...');
  restartCount = 0;
  svc.start();
});

svc.on('alreadyinstalled', () => {
  mainWindow?.webContents.send('bot-status', '⚠️ Service already installed. Starting...');
  svc.start();
});

svc.on('start', () => mainWindow?.webContents.send('bot-status', '🚀 Bot started.'));
svc.on('stop', () => {
  mainWindow?.webContents.send('bot-status', '🛑 Bot stopped.');
  if (restartCount < MAX_RESTARTS) {
    restartCount++;
    mainWindow?.webContents.send('bot-status', `Restarting (${restartCount}/${MAX_RESTARTS})...`);
    setTimeout(() => svc.start(), 5000);
  } else {
    mainWindow?.webContents.send('bot-status', 'Max restarts reached. Not restarting.');
  }
});
svc.on('error', (err) => mainWindow?.webContents.send('bot-status', `❌ Error: ${err.message}`));
svc.on('uninstall', () => mainWindow?.webContents.send('bot-status', '🗑 Service uninstalled.'));

// ---------------- ELECTRON GUI ----------------
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 300,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, 'index.html'));
}

app.whenReady().then(createWindow);

// ---------------- IPC ----------------
ipcMain.on('start-bot', () => {
  if (!Service.exists('Forlorn Clan Manager')) svc.install();
  else {
    svc.start();
    mainWindow?.webContents.send('bot-status', 'Starting...');
  }
});

ipcMain.on('stop-bot', () => svc.stop());

ipcMain.on('restart-bot', () => {
  svc.once('stop', () => {
    restartCount = 0;
    svc.start();
    mainWindow?.webContents.send('bot-status', 'Bot restarted.');
  });
  svc.stop();
  mainWindow?.webContents.send('bot-status', 'Restarting...');
});

ipcMain.on('get-status', () => {
  const exists = Service.exists('Forlorn Clan Manager');
  mainWindow?.webContents.send('bot-status', exists ? 'Installed' : 'Not Installed');
});

ipcMain.on('uninstall-bot', () => svc.uninstall());
