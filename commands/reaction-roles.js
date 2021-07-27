const Discord = require('discord.js');
const { PREFIX, COLORS, TEAM_EMOJIS, REACTION_TYPE } = require('../utils/constants');
const { addReactionRole } = require('../firebase/firebase_handler');
const { sendDissapearingMessage } = require('../utils/functions');
const { logger } = require('../utils/logger');

module.exports = {
    name: 'reaction-roles',
    usage: `${PREFIX}reaction-roles <@role_1> [..@role_N]`,
    description: 'Creates reaction role with given no. of role tags',

    /**
     * @param {Discord.Message} message
     */
    async execute(message) {
        if (!message.member.hasPermission('BAN_MEMBERS')) {
            return sendDissapearingMessage(message, `You are not wise enough to give roles to others ${message.member}`);
        }
        if (message.mentions.roles.size === 0) {
            return sendDissapearingMessage(message, `You didn't tag a role, ${message.author}!`);
        }

        const teamData = message.mentions.roles
            .array()
            .sort()
            .map((e) => ({ role: e }));

        const TEAM_NO = message.mentions.roles.size;
        if (TEAM_NO > TEAM_EMOJIS.length) {
            return sendDissapearingMessage(message, `Roles number can't be greater than ${TEAM_EMOJIS.length}, ${message.author}!`);
        }

        const desc = [];
        for (let i = 0; i < TEAM_NO; i++) desc.push(`${teamData[i].role} :  ${TEAM_EMOJIS[i]}\n`);

        const reactionEmbed = new Discord.MessageEmbed({
            title: 'React the following emojis to get roles',
            description: desc.join('\n'),
            color: COLORS.orange,
        });

        logger.info(`Reaction roles created by ${message.author.tag}`);

        const reactionMessage = await message.channel.send(reactionEmbed);
        for (let i = 0; i < TEAM_NO; i++) await reactionMessage.react(TEAM_EMOJIS[i]);

        await addReactionRole(reactionMessage, teamData, REACTION_TYPE.TEAM);
    },
};
