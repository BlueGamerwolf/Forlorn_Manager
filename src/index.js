require("dotenv").config();
const {
  Client,
  GatewayIntentBits,
  REST,
  Routes,
  SlashCommandBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder,
  Events,
  EmbedBuilder
} = require("discord.js");

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildVoiceStates],
});

const ROLE_TO_MUTE = "1411517952481689640";
const ROLE_EXEMPT_TESTER = "1421972209546821712";
const CHALLENGER_ROLE = "1419513465764057178";
const PASSED_ROLE = "1411391337512698007";
const FAILED_ROLE = "1411517952481689640";
const DJBLUE_ID = "1255287940775678048";

let scoreboard = { Tester: 0, Challenger: 0 };
let selectedPlayer = null;

function resetScores() {
  scoreboard = { Tester: 0, Challenger: 0 };
}

const commands = [
  new SlashCommandBuilder()
    .setName("tryouts")
    .setDescription("Manage tryouts")
    .addSubcommand(sub => sub.setName("begin").setDescription("Start tryouts and mute players"))
    .addSubcommand(sub => sub.setName("end").setDescription("End tryouts and unmute players"))
    .addSubcommand(sub => sub.setName("challenger")
      .setDescription("Set the challenger")
      .addUserOption(opt => opt.setName("user").setDescription("User to set as challenger").setRequired(true)))
    .addSubcommand(sub => sub.setName("check").setDescription("Check the interactive scoreboard"))
    .addSubcommand(sub => sub.setName("pass")
      .setDescription("Mark a challenger as passed")
      .addUserOption(opt => opt.setName("user").setDescription("User who passed").setRequired(true)))
    .addSubcommand(sub => sub.setName("fail")
      .setDescription("Mark a challenger as failed")
      .addUserOption(opt => opt.setName("user").setDescription("User who failed").setRequired(true)))
    .toJSON()
];

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
const GUILD_ID = "1411390758661132551";

(async () => {
  try {
    console.log("Registering slash commands to guild...");
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, GUILD_ID),
      { body: commands }
    );
    console.log("Slash commands registered to guild!");
  } catch (err) {
    console.error(err);
  }
})();

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
  if (interaction.isChatInputCommand()) {
    const sub = interaction.options.getSubcommand();

    if (sub === "begin") {
      resetScores();
      const guild = interaction.guild;
      const role = guild.roles.cache.get(ROLE_TO_MUTE);
      if (role) {
        role.members.forEach(member => {
          if (!member.roles.cache.has(ROLE_EXEMPT_TESTER)) {
            if (member.voice.channel) member.voice.setMute(true, "Tryouts begin");
          }
        });
      }
      await interaction.reply("🔇 Tryouts have begun! Scoreboard reset to 0-0.");
    }

    if (sub === "end") {
      const guild = interaction.guild;
      const role = guild.roles.cache.get(ROLE_TO_MUTE);
      if (role) {
        role.members.forEach(member => {
          if (member.voice.channel) member.voice.setMute(false, "Tryouts ended");
        });
      }
      await interaction.reply("🔊 Tryouts have ended! Players unmuted.");
    }

    if (sub === "challenger") {
      const user = interaction.options.getUser("user");
      const member = await interaction.guild.members.fetch(user.id);
      await member.roles.add(CHALLENGER_ROLE);
      scoreboard.Challenger = 0;
      await interaction.reply(`⚔️ ${user.username} is now the challenger! Scoreboard reset for them.`);
    }

    if (sub === "pass") {
      const user = interaction.options.getUser("user");
      const member = await interaction.guild.members.fetch(user.id);
      await member.roles.remove(CHALLENGER_ROLE);
      await member.roles.add(PASSED_ROLE);
      resetScores();
      await interaction.reply(`✅ ${user.username} has passed! Scoreboard reset.`);
    }

    if (sub === "fail") {
      const user = interaction.options.getUser("user");
      const member = await interaction.guild.members.fetch(user.id);
      await member.roles.remove(CHALLENGER_ROLE);
      await member.roles.add(FAILED_ROLE);
      resetScores();
      await interaction.reply(`❌ ${user.username} has failed! Scoreboard reset.`);
    }

    if (sub === "check") {
      const embed = new EmbedBuilder()
        .setTitle("🏆 Tryouts Scoreboard")
        .setColor("Blue")
        .addFields(
          { name: "Tester", value: `${scoreboard.Tester}`, inline: true },
          { name: "Challenger", value: `${scoreboard.Challenger}`, inline: true }
        );

      const select = new StringSelectMenuBuilder()
        .setCustomId("select_player")
        .setPlaceholder("Select side to adjust")
        .addOptions([
          { label: "Tester", value: "Tester" },
          { label: "Challenger", value: "Challenger" }
        ]);

      const selectRow = new ActionRowBuilder().addComponents(select);

      const buttonRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder().setCustomId("add_point").setLabel("+1").setStyle(ButtonStyle.Success),
        new ButtonBuilder().setCustomId("remove_point").setLabel("-1").setStyle(ButtonStyle.Danger),
        new ButtonBuilder().setCustomId("reset_score").setLabel("Reset Scoreboard").setStyle(ButtonStyle.Secondary)
      );

      await interaction.reply({ embeds: [embed], components: [selectRow, buttonRow] });
    }
  }

  if (interaction.isStringSelectMenu() && interaction.customId === "select_player") {
    selectedPlayer = interaction.values[0];
    await interaction.reply({ content: `Selected **${selectedPlayer}**`, ephemeral: true });
  }

  if (interaction.isButton()) {
    if (interaction.user.id !== DJBLUE_ID)
      return interaction.reply({ content: "❌ Only DJBlue can update scores.", ephemeral: true });

    if (interaction.customId === "reset_score") {
      resetScores();
      selectedPlayer = null;
      const embed = new EmbedBuilder()
        .setTitle("🏆 Tryouts Scoreboard")
        .setColor("Blue")
        .addFields(
          { name: "Tester", value: `${scoreboard.Tester}`, inline: true },
          { name: "Challenger", value: `${scoreboard.Challenger}`, inline: true }
        );
      return interaction.update({ embeds: [embed] });
    }

    if (!selectedPlayer)
      return interaction.reply({ content: "❌ Please select a side first.", ephemeral: true });

    if (interaction.customId === "add_point") scoreboard[selectedPlayer]++;
    if (interaction.customId === "remove_point") scoreboard[selectedPlayer]--;

    const embed = new EmbedBuilder()
      .setTitle("🏆 Tryouts Scoreboard")
      .setColor("Blue")
      .addFields(
        { name: "Tester", value: `${scoreboard.Tester}`, inline: true },
        { name: "Challenger", value: `${scoreboard.Challenger}`, inline: true }
      );

    await interaction.update({ embeds: [embed] });
  }
});

client.login(process.env.TOKEN);
