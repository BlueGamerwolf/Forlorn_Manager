import { LOGS } from "/callbacks/channels/Channels";

export async function logCommand(interaction) {
    try {
        const guild = interaction.guild;
        if (!guild) return;

        const logChannel = guild.channels.cache.get(LOGS);
        if (!logChannel) return;

        const userTag = interaction.user?.tag || "Unknown User";
        const commandName = interaction.commandName || "Unknown Command";
        const subcommand = interaction.options.getSubcommand(false);
        const timestamp = new Date().toLocaleString();

        let description = `🧭 **Command:** \`/${commandName}\``;
        if (subcommand) description += ` → \`${subcommand}\``;

        await logChannel.send({
            embeds: [
                {
                    title: "📋 Command Executed",
                    color: 2829617,
                    fields: [
                        { name: "User", value: userTag, inline: true },
                        { name: "Channel", value: `<#${interaction.channelId}>`, inline: true },
                        { name: "Time", value: timestamp, inline: false },
                        { name: "Details", value: description },
                    ],
                    footer: { text: `User ID: ${interaction.user.id}` },
                    timestamp: new Date(),
                },
            ],
        });
    } catch (err) {
        console.error("Failed to log command:", err);
    }
}
