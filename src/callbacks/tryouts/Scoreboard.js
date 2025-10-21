const { EmbedBuilder } = require("discord.js");

let scoreboard = { Tester: 0, Challenger: 0 };
let selectedPlayer = null;

function resetScores() {
  scoreboard = { Tester: 0, Challenger: 0 };
}

function getScoreboardEmbed() {
  return new EmbedBuilder()
    .setTitle("🏆 Tryouts Scoreboard")
    .setColor("Blue")
    .addFields(
      { name: "Tester", value: `${scoreboard.Tester}`, inline: true },
      { name: "Challenger", value: `${scoreboard.Challenger}`, inline: true }
    );
}

function updateScore(action) {
  if (!selectedPlayer) return false;

  switch (action) {
    case "add":
      scoreboard[selectedPlayer]++;
      break;
    case "remove":
      scoreboard[selectedPlayer]--;
      break;
    case "reset":
      resetScores();
      break;
  }
  return true;
}

async function handleSelect(interaction) {
  selectedPlayer = interaction.values[0];
  await interaction.reply({ content: `Selected **${selectedPlayer}** for score updates.`, ephemeral: true });
}

async function handleButton(interaction, hasPermission) {
  if (!hasPermission)
    return interaction.reply({ content: "❌ You don’t have permission to update the scoreboard.", ephemeral: true });

  const id = interaction.customId;
  if (id === "reset_score") {
    resetScores();
    selectedPlayer = null;
  } else if (!selectedPlayer) {
    return interaction.reply({ content: "❌ Please select a side first.", ephemeral: true });
  } else if (id === "add_point") {
    scoreboard[selectedPlayer]++;
  } else if (id === "remove_point") {
    scoreboard[selectedPlayer]--;
  }

  const embed = getScoreboardEmbed();
  await interaction.update({ embeds: [embed] });
}

module.exports = {
  getScoreboardEmbed,
  handleSelect,
  handleButton,
  resetScores,
  updateScore,
  scoreboard,
};
