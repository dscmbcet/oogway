const Discord = require('discord.js');
const { colors, prefix } = require('../utils/constants');

module.exports = {
    name: 'ban',
    usage: `${prefix}ban <@user-name>`,
    description: 'Bans a member from server',

    /**
     * @param {Discord.Message} message
     * @param {string[]} args
     */
    async execute(message, args) {
        const member = message.guild.member(message.author.id);
        let embed = new Discord.MessageEmbed();

        if (!message.member.hasPermission('BAN_MEMBERS')) {
            embed.setDescription(`You are not wise enough to make that call my friend ${member}`).setColor(colors.red);
            return message.channel.send(embed);
        }

        if (!message.mentions.users.size) {
            embed.setDescription(`You need to tag someone! ${member}`).setColor(member.displayHexColor);
        } else {
            const tagUser = message.mentions.users.first();
            const taggedUser = message.guild.member(tagUser);

            if (member == taggedUser) {
                embed.setDescription(`Why do you want to ban yourself my friend ${member}`).setColor(colors.red);
            } else {
                try {
                    await taggedUser.ban();
                    embed
                        .setFooter(`${tagUser.tag} has been banned`, taggedUser.user.displayAvatarURL())
                        .setColor(colors.cyan);
                } catch {
                    embed
                        .setFooter(`I am sorry but that person is wiser than you my friend ${member}`)
                        .setColor(colors.red);
                }
            }
        }

        return message.channel.send(embed);
    },
};
