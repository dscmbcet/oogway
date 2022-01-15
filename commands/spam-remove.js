const Discord = require('discord.js');
const { removeSpamLink } = require('../firebase');
const { COLORS, PREFIX } = require('../utils/constants');
const { sendDissapearingMessage } = require('../utils/functions');
const { logger } = require('../utils/logger');

module.exports = {
    name: 'spam-remove',
    admin: true,
    moderator: true,
    usage: `${PREFIX}spam-remove <link>`,
    description: 'Removes a spam link from auto kicking',

    /**
     * @param {Discord.Message} message
     * @param {string[]} args
     */
    async execute(message, args) {
        const author = message.guild.member(message.author.id);

        if (!message.member.hasPermission('MANAGE_MESSAGES')) {
            return sendDissapearingMessage(message, `:x: You do not have permission to remove spam links ${author}`);
        }

        args = args.filter((e) => e !== '');
        if (args.length < 1) return sendDissapearingMessage(message, `Please give a link ${author}`);

        const embed = new Discord.MessageEmbed();

        const link = args.join(' ').trim();

        if (await removeSpamLink(link)) {
            embed.setTitle(':white_check_mark: Removed Spam Link').setColor(COLORS.green).setDescription(`\`${link}\``);
        } else {
            embed.setTitle(':x: Spam Link May Not Exist').setColor(COLORS.red).setDescription(`\`${link}\``);
        }

        logger.info(`${link} spam link deleted by ${author.user.tag}`);
        return message.channel.send(embed);
    },
};
