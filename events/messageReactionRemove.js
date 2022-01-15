const Discord = require('discord.js');
const { reactionDataArray } = require('../firebase');
const { COLORS, TEAM_EMOJIS, REACTION_TYPE } = require('../utils/constants');
const { findRoleById, findChannelById, sendDissapearingMessage } = require('../utils/functions');
const { logger } = require('../utils/logger');

/**
 * @typedef {import('../utils/models/FirebaseReaction').FirebaseReactionTeamPoll} FirebaseReactionTeamPoll
 */

module.exports = {
    name: 'messageReactionRemove',

    /**
     * @param {Discord.MessageReaction} reaction
     * @param {Discord.User | Discord.PartialUser} user
     */
    async execute(reaction, user) {
        if (reaction.message.partial) await reaction.message.fetch();
        if (reaction.partial) await reaction.fetch();
        if (user.bot) return;

        const reactionRole = reactionDataArray.find((e) => e.id === reaction.message.id);
        if (!reactionRole) return;

        const args = [reaction, user, reactionRole];
        if (reactionRole.type === REACTION_TYPE.TEAM) this.handleTeamReaction(...args);
    },

    /**
     * @param {Discord.MessageReaction} reaction
     * @param {Discord.User | Discord.PartialUser} user
     * @param {FirebaseReactionTeamPoll} reactionRole
     */
    async handleTeamReaction(reaction, user, reactionRole) {
        let embed;
        const teamData = reactionRole.data.map((e) => {
            if (!e.channel) return { role: findRoleById(reaction.message, e.role) };
            return {
                role: findRoleById(reaction.message, e.role),
                channel: findChannelById(reaction.message, e.channel),
            };
        });

        const teamNo = TEAM_EMOJIS.findIndex((e) => e === reaction.emoji.name);
        try {
            const userRoles = reaction.message.guild.members.cache.get(user.id).roles;
            userRoles.remove(teamData[teamNo].role.id);
        } catch (e) {
            logger.error(`Event: ${this.name}, User:  ${user.username} Error: `, e);
            return sendDissapearingMessage(
                reaction.message,
                `Some error occured removing your ${teamData[teamNo].role} role my friend ${user}`
            );
        }

        if (teamData[teamNo].channel) {
            embed = new Discord.MessageEmbed({
                footer: {
                    text: `${user.username} has left this team`,
                    icon_url: user.displayAvatarURL(),
                },
                color: COLORS.red,
            });
            await teamData[teamNo].channel.send(embed);
        }
    },
};
