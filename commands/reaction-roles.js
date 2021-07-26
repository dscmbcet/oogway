const Discord = require('discord.js');
const { colors, prefix, team_emojis, REACTION_TYPE } = require('../utils/constants');
const { addReactionRole } = require('../firebase/firebase_handler');
const { sendDissapearingMessage } = require('../utils/functions');
const { logger } = require('../utils/logger');

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
        if (!message.member.hasPermission('BAN_MEMBERS'))
            return sendDissapearingMessage(message, `You are not wise enough to give roles to others ${message.member}`);
        else if (message.mentions.roles.size === 0)
            return sendDissapearingMessage(message, `You didn't tag a role, ${message.author}!`);
        else {
            let team_data = message.mentions.roles
                .array()
                .sort()
                .map(e => {
                    return { role: e };
                });

            const TEAM_NO = message.mentions.roles.size;
            if (TEAM_NO > team_emojis.length)
                return sendDissapearingMessage(
                    message,
                    `Roles number can't be greater than ${team_emojis.length}, ${message.author}!`
                );

            let desc = [];
            for (let i = 0; i < TEAM_NO; i++) desc.push(`${team_data[i].role} :  ${team_emojis[i]}\n`);

            let reaction_embed = new Discord.MessageEmbed({
                title: 'React the following emojis to get roles',
                description: desc.join('\n'),
                color: colors.orange,
            });

            logger.info(`Reaction roles created by ${message.author.tag}`);

            let reaction_msg = await message.channel.send(reaction_embed);
            for (let i = 0; i < TEAM_NO; i++) await reaction_msg.react(team_emojis[i]);

            await addReactionRole(reaction_msg, team_data, REACTION_TYPE.TEAM);
        }
    },
};
