const { Service } = require('node-windows');
const svc = new Service({
  name: 'Forlorn Clan Manager',
  description: 'Manages the Forlorn Rivals Clan Discord bot',
  script: 'C:\\Users\\bluem\\Forlorn_Manager\\index.js'
});
svc.on('install', () => {
  console.log('Service installed. Starting now...');
  svc.start();
});
svc.on('alreadyinstalled', () => {
  console.log('Service already installed. Starting...');
  svc.start();
});
svc.on('start', () => console.log('Service started!'));
svc.on('error', err => console.error('Service error:', err));
svc.install();
