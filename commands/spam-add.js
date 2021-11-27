const Discord = require('discord.js');
const { addSpamLink } = require('../firebase/firebase_handler');
const { COLORS, PREFIX } = require('../utils/constants');
const { sendDissapearingMessage } = require('../utils/functions');
const { logger } = require('../utils/logger');

module.exports = {
    name: 'spam-add',
    admin: true,
    moderator: true,
    usage: `${PREFIX}spam-add <link>`,
    description: 'Adds a spam link for auto kicking',

    /**
     * @param {Discord.Message} message
     * @param {string[]} args
     */
    async execute(message, args) {
        const author = message.guild.member(message.author.id);

        if (!message.member.hasPermission('MANAGE_MESSAGES')) {
            return sendDissapearingMessage(message, `:x: You do not have permission to add spam links ${author}`);
        }

        args = args.filter((e) => e !== '');
        if (args.length < 1) return sendDissapearingMessage(message, `Please give a link ${author}`);

        const embed = new Discord.MessageEmbed();

        const link = args.join(' ').trim();

        if (await addSpamLink(link)) {
            embed.setTitle(':white_check_mark: Added spam jink').setColor(COLORS.green).setDescription(`\`${link}\``);
        } else {
            embed.setTitle(':x: Spam link may already exist').setColor(COLORS.red).setDescription(`\`${link}\``);
        }

        logger.info(`${link} spam link added by ${author.user.tag}`);
        return message.channel.send(embed);
    },
};
