require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const { Service } = require('node-windows');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates,
  ],
});

client.login(process.env.TOKEN);

client.once('ready', () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

function stopBot() {
  console.log('⚠️ Stopping bot...');
  client.destroy();
  process.exit();
}

process.on('SIGINT', stopBot);
process.on('SIGTERM', stopBot);

const svc = new Service({
  name: 'Forlorn Clan Manager',
  script: 'C:\\Users\\bluem\\Forlorn_Manager\\src\\index.js'
});

Service.exists('Forlorn Clan Manager', (exists) => {
  if (exists) {
    console.log('Service exists. Stopping service...');
    svc.stop();
    svc.on('stop', () => {
      console.log('Service stopped!');
      stopBot();
    });
  } else {
    console.log('Service not installed. Stopping bot only...');
    stopBot();
  }
});
