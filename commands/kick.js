const Discord = require('discord.js');
const { colors, prefix } = require('../utils/constants');

module.exports = {
    name: 'kick',
    usage: `${prefix}kick <@user-name>`,
    description: 'Kicks a member from server',

    /**
     * @param {Discord.Message} message
     */
    async execute(message) {
        const member = message.guild.member(message.author.id);
        let embed;

        if (!message.member.hasPermission('KICK_MEMBERS')) {
            embed = new Discord.MessageEmbed({
                description: `You are not wise enough to make that call my friend** ${member}**`,
                color: colors.red,
            });
            return message.channel.send({ embed });
        }

        if (message.mentions.users.first()) {
            embed = new Discord.MessageEmbed({
                description: `You need to tag someone! ${member}`,
                color: member.displayHexColor,
            });
        } else {
            const tagUser = message.mentions.users.first();
            const taggedUser = message.guild.member(tagUser);

            if (member == taggedUser) {
                embed = new Discord.MessageEmbed({
                    description: `Why do you want to kick yourself my friend ${member}`,
                    color: colors.red,
                });
            } else if (taggedUser.user.bot) {
                embed = new Discord.MessageEmbed({
                    description: `If you kick me who will guide you my friend ${member}`,
                    color: colors.red,
                });
            } else {
                try {
                    await taggedUser.kick();
                    embed = new Discord.MessageEmbed({
                        footer: {
                            text: `${tagUser.tag} has been kicked`,
                            icon_url: taggedUser.user.displayAvatarURL(),
                        },
                        color: colors.cyan,
                    });
                } catch (e) {
                    embed = new Discord.MessageEmbed({
                        description: `I am sorry but that person is wiser than you my friend ${member}`,
                        color: colors.red,
                    });
                }
            }
        }

        return message.channel.send(embed);
    },
};
