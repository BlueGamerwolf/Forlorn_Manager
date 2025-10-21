const { SlashCommandBuilder } = require('discord.js');
const Roles = require('../callbacks/roles/Roles.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clanadmin')
        .setDescription('Commands for Clan Admins (lowest tier)')
        .addSubcommand(subcommand =>
            subcommand
                .setName('kick')
                .setDescription('Kick a member from the clan')
                .addUserOption(option =>
                    option.setName('target')
                        .setDescription('The member to kick')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('mute')
                .setDescription('Mute a member in the clan')
                .addUserOption(option =>
                    option.setName('target')
                        .setDescription('The member to mute')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('announce')
                .setDescription('Send a clan announcement')
                .addStringOption(option =>
                    option.setName('message')
                        .setDescription('The announcement text')
                        .setRequired(true))),
    
    async execute(interaction) {
        const member = interaction.member;

        if (!member.roles.cache.has(Roles.CLAN_ADMIN)) {
            return interaction.reply({ content: "You must be a Clan Admin to run this command.", ephemeral: true });
        }

        const subcommand = interaction.options.getSubcommand();
        const targetUser = interaction.options.getUser('target');

        if (subcommand === 'kick') {
            const targetMember = await interaction.guild.members.fetch(targetUser.id);
            await targetMember.kick(`Kicked by Clan Admin ${interaction.user.tag}`);
            return interaction.reply(`${targetUser.tag} has been kicked from the clan.`);
        }

        if (subcommand === 'mute') {
            const targetMember = await interaction.guild.members.fetch(targetUser.id);
            await targetMember.roles.add(Roles.CLAN_MUTE);
            return interaction.reply(`${targetUser.tag} has been muted.`);
        }

        if (subcommand === 'announce') {
            const message = interaction.options.getString('message');
            const announceChannel = interaction.channel;
            await announceChannel.send(`📢 Clan Announcement from ${interaction.user.tag}: ${message}`);
            return interaction.reply({ content: "Announcement sent!", ephemeral: true });
        }
    },
};
