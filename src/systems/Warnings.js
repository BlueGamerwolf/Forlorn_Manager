const { EmbedBuilder } = require("discord.js");
const Channels = require("/callback/channels/Channels");
const Roles = require("/callback/roles/Roles");
require("dotenv").config();

const warnings = new Map();

module.exports = {
  async addWarning(member, staff, reason = "No reason provided") {
    const userId = member.id;
    const guild = member.guild;
    const logChannel = guild.channels.cache.get(Channels.WARNINGS);

    const count = (warnings.get(userId) || 0) + 1;
    warnings.set(userId, count);

    const embed = new EmbedBuilder()
      .setTitle("⚠️ Warning Issued")
      .setColor("Yellow")
      .addFields(
        { name: "User", value: `${member.user.tag} (${member.id})`, inline: false },
        { name: "Issued by", value: `${staff.user.tag}`, inline: false },
        { name: "Reason", value: reason, inline: false },
        { name: "Total Warnings", value: `${count}`, inline: true }
      )
      .setTimestamp();

    if (logChannel) await logChannel.send({ embeds: [embed] });

    await this.enforcePunishment(guild, member, count);
  },

  async enforcePunishment(guild, member, count) {
    const inviteLink = process.env.INVITE;
    const dm = await member.createDM().catch(() => null);

    if (count === 3) {
      await member.roles.add(Roles.ROLE_TO_MUTE).catch(console.error);
      if (dm) await dm.send(`🔇 You have been muted for 5 hours due to accumulating 3 warnings.`);

      setTimeout(async () => {
        await member.roles.remove(Roles.ROLE_TO_MUTE).catch(console.error);
        if (dm) await dm.send("✅ Your mute period has ended. Please follow the rules.");
      }, 5 * 60 * 60 * 1000);

    } else if (count === 5) {
      if (dm) await dm.send(`⛔ You have been banned for 3 days due to 5 warnings.`);

      await member.ban({ reason: "5 warnings reached" }).catch(console.error);

      setTimeout(async () => {
        await guild.members.unban(member.id, "Ban period over").catch(console.error);
        if (dm) await dm.send(`✅ Your 3-day ban is over. You may rejoin here: ${inviteLink}`);
      }, 3 * 24 * 60 * 60 * 1000);

    } else if (count >= 7) {
      if (dm) await dm.send(`🚷 You have been permanently banned due to 7 warnings.`);
      await member.ban({ reason: "Permanent ban — 7 warnings reached" }).catch(console.error);
    }
  },

  clearWarnings(userId) {
    warnings.delete(userId);
  },

  getWarnings(userId) {
    return warnings.get(userId) || 0;
  },
};
