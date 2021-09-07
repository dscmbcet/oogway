const Discord = require('discord.js');
const { PREFIX, COLORS } = require('../utils/constants');
const { sendDissapearingMessage } = require('../utils/functions');
const { logger } = require('../utils/logger');

module.exports = {
    name: 'kick',
    admin: true,
    usage: `${PREFIX}kick <@user-name>`,
    description: 'Kicks a member from server',

    /**
     * @param {Discord.Message} message
     */
    async execute(message) {
        const member = message.guild.member(message.author.id);

        if (!message.member.hasPermission('KICK_MEMBERS')) {
            return sendDissapearingMessage(message, `You are not wise enough to make that call my friend ${member}`);
        }
        if (!message.mentions.users.first()) {
            return sendDissapearingMessage(message, `You need to tag someone! ${member}`);
        }

        const tagUser = message.mentions.users.first();
        const taggedUser = message.guild.member(tagUser);

        if (member === taggedUser) return sendDissapearingMessage(message, `Why do you want to kick yourself my friend ${member}`);
        if (taggedUser.user.bot) return sendDissapearingMessage(message, `If you kick me who will guide you my friend ${member}`);

        try {
            await taggedUser.kick();
            const embed = new Discord.MessageEmbed({
                footer: {
                    text: `${tagUser.tag} has been kicked`,
                    icon_url: taggedUser.user.displayAvatarURL(),
                },
                color: COLORS.cyan,
            });
            logger.info(`${tagUser.tag} has been kicked`);
            return message.channel.send(embed);
        } catch {
            return sendDissapearingMessage(message, `I am sorry but that person is wiser than you my friend ${member}`);
        }
    },
};
