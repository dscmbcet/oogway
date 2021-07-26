const Discord = require('discord.js');
const { colors, prefix } = require('../utils/constants');
const { sendDissapearingMessage } = require('../utils/functions');

module.exports = {
    name: 'kick',
    usage: `${prefix}kick <@user-name>`,
    description: 'Kicks a member from server',

    /**
     * @param {Discord.Message} message
     */
    async execute(message) {
        const member = message.guild.member(message.author.id);

        if (!message.member.hasPermission('KICK_MEMBERS'))
            return sendDissapearingMessage(message, `You are not wise enough to make that call my friend ${member}`);
        else if (!message.mentions.users.first()) return sendDissapearingMessage(message, `You need to tag someone! ${member}`);
        else {
            const tagUser = message.mentions.users.first();
            const taggedUser = message.guild.member(tagUser);

            if (member == taggedUser) return sendDissapearingMessage(message, `Why do you want to kick yourself my friend ${member}`);
            else if (taggedUser.user.bot)
                return sendDissapearingMessage(message, `If you kick me who will guide you my friend ${member}`);
            else {
                try {
                    await taggedUser.kick();
                    let embed = new Discord.MessageEmbed({
                        footer: {
                            text: `${tagUser.tag} has been kicked`,
                            icon_url: taggedUser.user.displayAvatarURL(),
                        },
                        color: colors.cyan,
                    });
                    return message.channel.send(embed);
                } catch {
                    return sendDissapearingMessage(message, `I am sorry but that person is wiser than you my friend ${member}`);
                }
            }
        }
    },
};
