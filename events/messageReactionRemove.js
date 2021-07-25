const Discord = require('discord.js');
const { reactionDataArray } = require('../firebase/firebase_handler');
const colors = require('../utils/colors');
const { findRoleById, findChannelById, team_emojis, REACTION_TYPE } = require('../utils/functions');

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

        const reactionRole = reactionDataArray.find(e => e.id == reaction.message.id);
        if (!reactionRole) return;

        const args = [reaction, user, reactionRole];
        if (reactionRole.type == REACTION_TYPE.TEAM) this.handleTeamReaction(...args);
    },

    /**
     * @param {Discord.MessageReaction} reaction
     * @param {Discord.User | Discord.PartialUser} user
     */
    async handleTeamReaction(reaction, user, reactionRole) {
        let embed;
        const team_data = reactionRole.team_data.map(e => {
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
            user_roles.remove(team_data[team_no].role.id);
        } catch (e) {
            console.error(`Event: ${this.name}, User:  ${user.username} Error: ${e.name}: ${e.message}`);
            embed = new Discord.MessageEmbed({
                description: `Some error occured removing your ${team_data[team_no].role} role my friend** ${user}**`,
                color: colors.red,
            });
            return reaction.message.channel.send(embed);
        }

        if (team_data[team_no].channel) {
            embed = new Discord.MessageEmbed({
                footer: {
                    text: `${user.username} has left this team`,
                    icon_url: user.displayAvatarURL(),
                },
                color: colors.red,
            });
            await team_data[team_no].channel.send(embed);
        }
    },
};
