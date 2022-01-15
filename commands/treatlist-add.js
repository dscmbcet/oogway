const Discord = require('discord.js');
const { addToTreatList } = require('../firebase/treat');
const { PREFIX } = require('../utils/constants');
const { sendDissapearingMessage } = require('../utils/functions');

module.exports = {
    name: 'treatlist-add',
    usage: `${PREFIX}treatlist-add <@user_name> <reason>`,
    description: 'Adds the user to treatlist with given reason',

    /**
     * @param {Discord.Message} message
     * @param {string[]} args
     */
    async execute(message, args) {
        if (args.length < 2) {
            return sendDissapearingMessage(message, `Check your arguments, ${message.author}!`);
        }
        if (!message.mentions.users.first()) {
            return sendDissapearingMessage(message, `You need to tag someone! ${message.author}`);
        }

        const taggedUser = message.mentions.users.first();

        args.splice(0, 1);
        const description = args.join(' ').trim();
        await addToTreatList(message, taggedUser, description);

        const member = message.guild.member(taggedUser);
        const embed = new Discord.MessageEmbed()
            .setColor(member.roles.color.hexColor)
            .setFooter(description, taggedUser.displayAvatarURL())
            .setTitle(`${member.user.tag} added to treat list`);
        return message.channel.send(embed);
    },
};
