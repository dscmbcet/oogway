const Discord = require('discord.js');
const { updateBanOrKickMember } = require('../firebase/firebase_handler');

module.exports = {
    name: 'guildMemberRemove',

    /**
     * @param {Discord.GuildMember} member
     * */
    async execute(member) {
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
            }
        }
        if (kickLog && kickLog.createdAt > member.joinedAt) {
            if (kickLog.target.id === member.id) {
                updateBanOrKickMember(member, undefined, kickLog, true);
            }
        }
    },
};
