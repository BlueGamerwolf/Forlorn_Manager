require('dotenv').config({ path: './src/.env' });
const { REST, Routes } = require('discord.js');

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.TOKEN;

if (!clientId || !guildId || !token) {
  console.error("❌ Make sure CLIENT_ID, GUILD_ID, and TOKEN are set in src/.env");
  process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('❌ Clearing all guild commands...');
    await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: [] });
    console.log('✅ All guild commands cleared!');
  } catch (error) {
    console.error(error);
  }
})();
