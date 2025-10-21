const { SlashCommandBuilder } = require('discord.js');
const Roles = require('../callbacks/roles/Roles.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clanleader')
        .setDescription('Commands for Clan Leaders')
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
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('assigncoleader')
                .setDescription('Assign a member as a Co-Leader')
                .addUserOption(option =>
                    option.setName('target')
                        .setDescription('The member to promote to Co-Leader')
                        .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('removecoleader')
                .setDescription('Remove a member from Co-Leader role')
                .addUserOption(option =>
                    option.setName('target')
                        .setDescription('The Co-Leader to demote')
                        .setRequired(true))),
    
    async execute(interaction) {
        const member = interaction.member;

        if (!member.roles.cache.has(Roles.CLAN_LEADER)) {
            return interaction.reply({ content: "You must be a Clan Leader to run this command.", ephemeral: true });
        }

        const subcommand = interaction.options.getSubcommand();
        const targetUser = interaction.options.getUser('target');

        if (subcommand === 'kick') {
            const targetMember = await interaction.guild.members.fetch(targetUser.id);
            await targetMember.kick(`Kicked by Clan Leader ${interaction.user.tag}`);
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

        if (subcommand === 'assigncoleader') {
            const targetMember = await interaction.guild.members.fetch(targetUser.id);
            await targetMember.roles.add(Roles.CLAN_COLEADER);
            return interaction.reply(`${targetUser.tag} has been assigned as a Clan Co-Leader.`);
        }

        if (subcommand === 'removecoleader') {
            const targetMember = await interaction.guild.members.fetch(targetUser.id);
            await targetMember.roles.remove(Roles.CLAN_COLEADER);
            return interaction.reply(`${targetUser.tag} has been removed from Clan Co-Leader role.`);
        }
    },
};
