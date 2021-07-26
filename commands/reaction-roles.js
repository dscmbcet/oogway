const Discord = require('discord.js');
const { colors, prefix, team_emojis, REACTION_TYPE } = require('../utils/constants');
const { addReactionRole } = require('../firebase/firebase_handler');

module.exports = {
    name: 'reaction-roles',
    usage: `${prefix}reaction-roles <@role_1> [..@role_N]`,
    description: 'Creates reaction role with given no. of role tags',

    /**
     * @param {Discord.Message} message
     * @param {string[]} args
     * @param {Discord.Client} client
     */
    async execute(message, args, client) {
        if (message.mentions.roles.size === 0)
            return message.channel.send(`You didn't provide any roles, ${message.author}!`);
        else {
            let team_data = message.mentions.roles
                .array()
                .sort()
                .map(e => {
                    return { role: e };
                });

            if (!message.member.hasPermission('ADMINISTRATOR')) {
                embed = new Discord.MessageEmbed({
                    description: `You are not wise enough to give roles to others** ${message.member}**`,
                    color: colors.red,
                });
                return message.channel.send(embed);
            }

            const TEAM_NO = message.mentions.roles.size;
            if (TEAM_NO > team_emojis.length) {
                embed = new Discord.MessageEmbed({
                    title: `Roles Can't Be Greater Than ${team_emojis.length}`,
                    color: colors.red,
                });
                return message.channel.send(embed);
            }

            let desc = [];
            for (let i = 0; i < TEAM_NO; i++) desc.push(`${team_data[i].role} :  ${team_emojis[i]}\n`);

            let reaction_embed = new Discord.MessageEmbed({
                title: 'React the following emojis to get roles',
                description: desc.join('\n'),
                color: colors.orange,
            });

            let reaction_msg = await message.channel.send(reaction_embed);
            for (let i = 0; i < TEAM_NO; i++) await reaction_msg.react(team_emojis[i]);

            await addReactionRole(reaction_msg, team_data, REACTION_TYPE.TEAM);
        }
    },
};
