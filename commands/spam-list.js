const Discord = require('discord.js');
const { COLORS, PREFIX } = require('../utils/constants');
const { sendDissapearingMessage } = require('../utils/functions');
const { firebaseSpamLinkArray } = require('../firebase/firebase_handler');

module.exports = {
    name: 'spam-list',
    admin: true,
    moderator: true,
    usage: `${PREFIX}spam-list`,
    description: 'View the current spam links for auto kicking',

    /**
     * @param {Discord.Message} message
     */
    async execute(message) {
        const author = message.guild.member(message.author.id);

        if (!message.member.hasPermission('MANAGE_MESSAGES')) {
            return sendDissapearingMessage(message, `:x: You do not have permission to use this ${author}`);
        }

        const embed = new Discord.MessageEmbed();

        const spamArray = firebaseSpamLinkArray.map((e) => e.link);
        if (spamArray.length === 0) {
            embed.setTitle('Spam link list empty').setColor(COLORS.red);
            return message.channel.send(embed);
        }

        embed
            .setTitle('Spam link list')
            .setColor(COLORS.cyan)
            .setDescription(`\`\`\`${spamArray.join('\n')}\`\`\``);

        return message.channel.send(embed);
    },
};
