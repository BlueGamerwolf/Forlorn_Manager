const { Service } = require('node-windows');
const path = require('path');

const BOT_PATH = path.join('C:\\', 'Users', 'bluem', 'Forlorn_Manager', 'index.js');

const svc = new Service({
  name: 'Forlorn Clan Manager',
  description: 'Hi, I am the Manager for Forlorn Rivals Clan.',
  script: BOT_PATH,
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=200'
  ],
  wait: 2,
  grow: .5,
  maxRestarts: 5,
});

svc.on('install', () => {
  console.log('✅ Service installed successfully!');
  console.log('Starting service...');
  svc.start();
});

svc.on('alreadyinstalled', () => {
  console.log('⚠️ Service is already installed.');
});

svc.on('start', () => {
  console.log('🚀 Forlorn Clan Manager service started.');
});

svc.on('error', (err) => {
  console.error('❌ Service error:', err);
});

svc.install();
