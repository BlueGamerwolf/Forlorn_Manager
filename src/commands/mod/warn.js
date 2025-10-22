const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const Warnings = require('../../systems/Warnings.js');
const Roles = require("../../callbacks/roles/Roles");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("warn")
    .setDescription("Issue a warning to a member")
    .addUserOption(opt => opt.setName("user").setDescription("User to warn").setRequired(true))
    .addStringOption(opt => opt.setName("reason").setDescription("Reason for the warning").setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

  async execute(interaction) {
    const member = interaction.options.getMember("user");
    const reason = interaction.options.getString("reason") || "No reason provided";

    if (!member) return interaction.reply({ content: "❌ User not found.", ephemeral: true });
    if (member.id === interaction.user.id)
      return interaction.reply({ content: "❌ You cannot warn yourself.", ephemeral: true });

    if (!Roles.isClanStaff(interaction.member) && !Roles.hasScoreboardAccess(interaction.member))
      return interaction.reply({ content: "🚫 You do not have permission to warn members.", ephemeral: true });

    await Warnings.addWarning(member, interaction.member, reason);

    await interaction.reply(`⚠️ Warning issued to **${member.user.tag}** for: ${reason}`);
  },
};
