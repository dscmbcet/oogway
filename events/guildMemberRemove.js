const Discord = require('discord.js'); // eslint-disable-line no-unused-vars
const { updateBanOrKickMember } = require('../firebase/ban');
const { COLORS } = require('../utils/constants');
const { logger } = require('../utils/logger');

module.exports = {
    name: 'guildMemberRemove',

    /**
     * @param {Discord.GuildMember} member
     * @param {Discord.Client} client
     * */
    async execute(member, client) {
        const serverConfig = client.configs.get(member.guild.id);
        const channel = client.channels.cache.get(serverConfig.moderator_channel_id);
        const embed = new Discord.MessageEmbed();

        const bannedLog = (
            await member.guild.fetchAuditLogs({
                limit: 1,
                type: 'MEMBER_BAN_ADD',
            })
        ).entries.first();

        const kickLog = (
            await member.guild.fetchAuditLogs({
                limit: 1,
                type: 'MEMBER_KICK',
            })
        ).entries.first();

        if (bannedLog && bannedLog.createdAt > member.joinedAt) {
            if (bannedLog.target.id === member.id) {
                updateBanOrKickMember(member, bannedLog, undefined, true);
                embed
                    .setTitle(`${member.user.tag} has been banned`)
                    .setThumbnail(member.user.displayAvatarURL())
                    .setDescription(`Reason: ${!bannedLog.reason ? '-' : bannedLog.reason}\n\nBy: \`${bannedLog.executor.tag}\``)
                    .setColor(COLORS.cyan);
                logger.info(`${member.user.tag} has been banned`);
                channel.send(embed);
            }
        }
        if (kickLog && kickLog.createdAt > member.joinedAt) {
            if (kickLog.target.id === member.id) {
                updateBanOrKickMember(member, undefined, kickLog, true);
                embed
                    .setTitle(`${member.user.tag} has been kicked`)
                    .setThumbnail(member.user.displayAvatarURL())
                    .setDescription(`Reason: ${!kickLog.reason ? '-' : kickLog.reason}\n\nBy: \`${kickLog.executor.tag}\``)
                    .setColor(COLORS.cyan);
                logger.info(`${member.user.tag} has been kicked`);
                channel.send(embed);
            }
        }
    },
};
