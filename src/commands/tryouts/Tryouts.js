const { Roles } = require("../callbacks/roles/Roles");
const { Users } = require("../callbacks/users/Users");

module.exports = {
  name: "tryout",
  description: "Approve or deny tryouts for the clan.",
  options: [
    {
      name: "user",
      description: "User to approve or deny.",
      type: 6,
      required: true,
    },
    {
      name: "action",
      description: "approve or deny",
      type: 3,
      required: true,
      choices: [
        { name: "Approve", value: "approve" },
        { name: "Deny", value: "deny" },
      ],
    },
  ],

  async execute(interaction) {
    const member = interaction.member;
    const targetUser = interaction.options.getUser("user");
    const action = interaction.options.getString("action");

    const allowed =
      member.roles.cache.has(Roles.CLAN_TRYOUTS) ||
      member.roles.cache.has(Roles.ADMIN) ||
      member.id === Users.DJBLUE;

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
