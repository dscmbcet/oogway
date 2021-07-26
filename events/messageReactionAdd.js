const Discord = require('discord.js');
const { reactionDataArray } = require('../firebase/firebase_handler');
const { FirebaseReaction } = require('../utils/models');
const { colors, REACTION_TYPE, team_emojis } = require('../utils/constants');
const { findRoleById, findChannelById, sendDissapearingMessage } = require('../utils/functions');
const { logger } = require('../utils/logger');

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

        const reactionRole = reactionDataArray.find(e => e.id == reaction.message.id);
        if (!reactionRole) return;

        const args = [reaction, user, reactionRole];
        if (reactionRole.type == REACTION_TYPE.TEAM) this.handleTeamReaction(...args);
        if (reactionRole.type == REACTION_TYPE.ANNOYMOUS) this.handleAnnonymousReaction(...args);
    },

    /**
     * @param {Discord.MessageReaction} reaction
     * @param {Discord.User | Discord.PartialUser} user
     * @param {FirebaseReaction} reactionRole
     */
    async handleTeamReaction(reaction, user, reactionRole) {
        let embed;
        const team_data = reactionRole.data.map(e => {
            if (!e.channel) return { role: findRoleById(reaction.message, e.role) };
            else
                return {
                    role: findRoleById(reaction.message, e.role),
                    channel: findChannelById(reaction.message, e.channel),
                };
        });

        const team_no = team_emojis.findIndex(e => e === reaction.emoji.name);
        try {
            const user_roles = await reaction.message.guild.members.cache.get(user.id).roles;
            user_roles.add(team_data[team_no].role.id);
        } catch (e) {
            logger.error(`Event: ${this.name}, User:  ${user.username} Error: `, e);
            return sendDissapearingMessage(
                reaction.message,
                `Some error occured assigning your ${team_data[team_no].role} role my friend ${user}`
            );
        }

        if (team_data[team_no].channel) {
            embed = new Discord.MessageEmbed({
                footer: {
                    text: `${user.username} has joined this team`,
                    icon_url: user.displayAvatarURL(),
                },
                color: colors.green,
            });
            await team_data[team_no].channel.send(embed);
        }
    },

    /**
     * @param {Discord.MessageReaction} reaction
     * @param {Discord.User | Discord.PartialUser} user
     * @param {FirebaseReaction} reactionRole
     */
    async handleAnnonymousReaction(reaction, user, reactionRole) {
        let user_id = user.id;
        let msg_embed = reaction.message.embeds[0];
        const reacted_emoji = reaction.emoji.name;
        reaction.message.reactions.resolve(reacted_emoji).users.remove(user);

        if (!reactionRole.content) reactionRole.content = msg_embed.description;

        msg_embed = new Discord.MessageEmbed()
            .setTitle(msg_embed.title)
            .setDescription(msg_embed.description)
            .setColor(msg_embed.color);

        const found = reactionRole.data.find(emoji => {
            return emoji.users.find(id => id === user_id);
        });

        if (found) {
            msg_embed.setFooter('❌ You cannot vote again').setColor(colors.red);
            return user.send(msg_embed).then(msg => {
                msg.delete({ timeout: 30000 });
            });
        }

        let votemsg = [];
        reactionRole.data.forEach((emojiData, index) => {
            if (reacted_emoji === emojiData.emoji) {
                reactionRole.data[index].count += 1;
                reactionRole.data[index].users.push(user_id);
            }
            votemsg.push(`${emojiData.emoji} - ${reactionRole.data[index].count}`);
        });
        msg_embed.setDescription(`${reactionRole.content}\n\nVotes\n\n` + votemsg.join('\n'));

        return reaction.message.edit(msg_embed);
    },
};
