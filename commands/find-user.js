const Discord = require('discord.js');
const { PREFIX } = require('../utils/constants');
const { sendDissapearingMessage } = require('../utils/functions');

module.exports = {
    name: 'find-user',
    usage: `${PREFIX}find-user <@user_name>`,
    description: 'Gives information about given user',

    /**
     * @param {Discord.Message} message
     */
    async execute(message) {
        if (!message.mentions.users.first()) return sendDissapearingMessage(message, `You didn't tag a user, ${message.author}!`);

        const taggedUser = message.mentions.users.first();
        const member = message.guild.member(taggedUser);
        const embed = new Discord.MessageEmbed()
            .setColor(member.roles.color.hexColor)
            .setThumbnail(taggedUser.displayAvatarURL())
            .addField(`${taggedUser.tag}`, `${member}`, true)
            .addField('ID:', `${member.id}`, true)
            .addField('Nickname:', `${member.nickname !== null ? `${member.nickname}` : 'None'}`, true)
            .addField('Joined', `${member.joinedAt.toDateString()}`, true)
            .addField('Roles:', member.roles.cache.map((roles) => `${roles}`).join(' '), true);
        return message.channel.send(embed);
    },
};
