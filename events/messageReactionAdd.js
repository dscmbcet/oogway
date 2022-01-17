const Discord = require('discord.js');
const { removeFromTreatList } = require('../firebase/treat');
const { reactionDataArray, removeReactionRole } = require('../firebase/reaction');
const { COLORS, REACTION_TYPE, TEAM_EMOJIS } = require('../utils/constants');
const { findRoleById, findChannelById, sendDissapearingMessage } = require('../utils/functions');
const { logger } = require('../utils/logger');

/**
 * @typedef {import('../types/FirebaseReaction').FirebaseReaction} FirebaseReaction
 * @typedef {import('../types/FirebaseReaction').FirebaseReactionTeamPoll} FirebaseReactionTeamPoll
 * @typedef {import('../types/FirebaseReaction').FirebaseReactionAnnoymous} FirebaseReactionAnnoymous
 * @typedef {import('../types/FirebaseReaction').FirebaseReactionAnnoymousTreat} FirebaseReactionAnnoymousTreat
 */

module.exports = {
    name: 'messageReactionAdd',

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
        if (reactionRole.type === REACTION_TYPE.ANNOYMOUS) this.handleAnnonymousReaction(...args);
        if (reactionRole.type === REACTION_TYPE.TREAT) this.handleAnnonymoustTreatReaction(...args);
    },

    /**
     * @param {Discord.MessageReaction} reaction
     * @param {Discord.User | Discord.PartialUser} user
     * @param {FirebaseReactionTeamPoll} reactionObject
     */
    async handleTeamReaction(reaction, user, reactionObject) {
        let embed;
        const teamData = reactionObject.data.map((e) => {
            if (!e.channel) return { role: findRoleById(reaction.message, e.role) };
            return {
                role: findRoleById(reaction.message, e.role),
                channel: findChannelById(reaction.message, e.channel),
            };
        });

        const teamNo = TEAM_EMOJIS.findIndex((e) => e === reaction.emoji.name);
        try {
            const userRoles = reaction.message.guild.members.cache.get(user.id).roles;
            userRoles.add(teamData[teamNo].role.id);
        } catch (e) {
            logger.error(`Event: ${this.name}, User:  ${user.username} Error: `, e);
            return sendDissapearingMessage(
                reaction.message,
                `Some error occured assigning your ${teamData[teamNo].role} role my friend ${user}`
            );
        }

        if (teamData[teamNo].channel) {
            embed = new Discord.MessageEmbed({
                footer: {
                    text: `${user.username} has joined this team`,
                    icon_url: user.displayAvatarURL(),
                },
                color: COLORS.green,
            });
            await teamData[teamNo].channel.send(embed);
        }
    },

    /**
     * @param {Discord.MessageReaction} reaction
     * @param {Discord.User | Discord.PartialUser} user
     * @param {FirebaseReactionAnnoymous} reactionObject
     */
    async handleAnnonymousReaction(reaction, user, reactionObject) {
        const userId = user.id;
        let embedMessage = reaction.message.embeds[0];
        const reactedEmoji = reaction.emoji.name;
        reaction.message.reactions.resolve(reactedEmoji).users.remove(user);

        if (!reactionObject.content) reactionObject.content = embedMessage.description;

        embedMessage = new Discord.MessageEmbed()
            .setTitle(embedMessage.title)
            .setDescription(embedMessage.description)
            .setColor(embedMessage.color);

        const found = reactionObject.data.find((emoji) => emoji.users.find((id) => id === userId));

        if (found) {
            embedMessage.setFooter('❌ You cannot vote again').setColor(COLORS.red);
            return user.send(embedMessage).then((msg) => {
                msg.delete({ timeout: 30000 });
            });
        }

        const votemsg = [];
        reactionObject.data.forEach((emojiData, index) => {
            if (reactedEmoji === emojiData.emoji) {
                reactionObject.data[index].count += 1;
                reactionObject.data[index].users.push(userId);
            }
            votemsg.push(`${emojiData.emoji} - ${reactionObject.data[index].count}`);
        });
        embedMessage.setDescription(`${reactionObject.content}\n\nVotes\n\n${votemsg.join('\n')}`);

        return reaction.message.edit(embedMessage);
    },

    /**
     * @param {Discord.MessageReaction} reaction
     * @param {Discord.User | Discord.PartialUser} user
     * @param {FirebaseReactionAnnoymousTreat} reactionObject
     */
    async handleAnnonymoustTreatReaction(reaction, user, reactionObject) {
        const userId = user.id;
        let embedMessage = reaction.message.embeds[0];
        const reactedEmoji = reaction.emoji.name;
        reaction.message.reactions.resolve(reactedEmoji).users.remove(user);

        if (!reactionObject.content) reactionObject.content = embedMessage.description;

        let treatData = reactionObject.data[0];
        const userToBeRemoved = reaction.message.guild.members.cache.get(treatData.user_id);
        const selfVoteFound = userId === userToBeRemoved.id;
        const found = reactionObject.data[0].users.find((id) => id === userId);

        embedMessage = new Discord.MessageEmbed()
            .setTitle(embedMessage.title)
            .setThumbnail(userToBeRemoved.user.displayAvatarURL())
            .setColor(embedMessage.color);

        if (selfVoteFound) {
            embedMessage.setFooter('❌ You cannot self vote').setColor(COLORS.red);
            return user.send(embedMessage).then((msg) => {
                msg.delete({ timeout: 30000 });
            });
        }
        if (found) {
            embedMessage.setFooter('❌ You cannot vote again').setColor(COLORS.red);
            return user.send(embedMessage).then((msg) => {
                msg.delete({ timeout: 30000 });
            });
        }

        if (reactedEmoji === treatData.emoji) {
            reactionObject.data[0].count += 1;
            reactionObject.data[0].users.push(userId);
        }
        // eslint-disable-next-line prefer-destructuring
        treatData = reactionObject.data[0];

        if (treatData.count >= treatData.min_count) {
            embedMessage
                .setTitle(`${userToBeRemoved.user.tag} removed from treat list`)
                .setDescription('')
                .setColor(COLORS.green)
                .setFooter(treatData.description, userToBeRemoved.user.displayAvatarURL());

            await removeReactionRole(reactionObject.id);
            await removeFromTreatList(treatData.treat_id);
            await reaction.message.channel.send(embedMessage);
            return reaction.message.delete();
        }
        embedMessage.setDescription(`Treat Reason: ${treatData.description}\n\n**Votes** - ${treatData.count}\n`);
        return reaction.message.edit(embedMessage);
    },
};
