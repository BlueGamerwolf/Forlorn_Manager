const { SlashCommandBuilder } = require("discord.js");
const { Roles } = require("../../callbacks/roles/Roles");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("tryout")
    .setDescription("Approve or deny tryouts for the clan.")
    .addUserOption(option =>
      option
        .setName("user")
        .setDescription("User to approve or deny.")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("action")
        .setDescription("approve or deny")
        .setRequired(true)
        .addChoices(
          { name: "Approve", value: "approve" },
          { name: "Deny", value: "deny" }
        )
    ),

  async execute(interaction) {
    const member = interaction.member;
    const targetUser = interaction.options.getUser("user");
    const action = interaction.options.getString("action");

    const allowed =
      member.roles.cache.has(Roles.CLAN_TRYOUTS) ||
      member.roles.cache.has(Roles.ADMIN);

    if (!allowed) {
      return interaction.reply({
        content: "🚫 You don't have permission to run this command.",
        ephemeral: true,
      });
    }

    if (action === "approve") {
      await interaction.reply(
        `✅ ${targetUser.username} has been **approved** for tryouts!`
      );
    } else if (action === "deny") {
      await interaction.reply(
        `❌ ${targetUser.username} has been **denied** for tryouts.`
      );
    } else {
      await interaction.reply("⚠️ Invalid action.");
    }
  },
};
