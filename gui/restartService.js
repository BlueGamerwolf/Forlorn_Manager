const { Service } = require('node-windows');

const svc = new Service({
  name: 'Forlorn Clan Manager',
  description: 'HI I am the Manager for Forlorn Rivals Clan',
  script: 'C:\\Users\\bluem\\Forlorn_Manager\\src\\index.js'
});

svc.on('stop', () => {
  console.log('Service stopped unexpectedly. Restarting...');
  setTimeout(() => svc.start(), 5000);
});

svc.on('install', () => {
  console.log('Service installed successfully. Starting...');
  svc.start();
});

svc.install();
