const Discord = require('discord.js');
const { prefix } = require('../utils/constants');
const { sendDissapearingMessage } = require('../utils/functions');
const { logger } = require('../utils/logger');

module.exports = {
    name: 'find-user',
    usage: `${prefix}find-user <@user_name>`,
    description: 'Gives information about given user',

    /**
     * @param {Discord.Message} message
     * @param {string[]} args
     */
    async execute(message, args) {
        if (!message.mentions.users.first()) return sendDissapearingMessage(message, `You didn't tag a user, ${message.author}!`);
        else {
            const tag_user = message.mentions.users.first();
            const member = message.guild.member(tag_user);
            const embed = new Discord.MessageEmbed()
                .setColor(member.roles.color.hexColor)
                .setThumbnail(tag_user.displayAvatarURL())
                .addField(`${tag_user.tag}`, `${member}`, true)
                .addField('ID:', `${member.id}`, true)
                .addField('Nickname:', `${member.nickname !== null ? `${member.nickname}` : 'None'}`, true)
                .addField(`Joined`, `${member.joinedAt.toDateString()}`, true)
                .addField('Roles:', member.roles.cache.map(roles => `${roles}`).join(' '), true);
            return message.channel.send(embed);
        }
    },
};
