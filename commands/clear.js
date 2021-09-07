const Discord = require('discord.js');
const { COLORS, PREFIX } = require('../utils/constants');
const { sendDissapearingMessage } = require('../utils/functions');
const { logger } = require('../utils/logger');

module.exports = {
    name: 'clear',
    admin: true,
    usage: `${PREFIX}clear <NUMBER>`,
    description: 'Clear upto 100 messages',

    /**
     * @param {Discord.Message} message
     * @param {string[]} args
     */
    async execute(message, args) {
        if (!message.member.hasPermission('ADMINISTRATOR')) {
            return sendDissapearingMessage(message, `You are not wise enough to do that ${message.author}`);
        }
        if (!args[0] || Number.isNaN(args[0])) {
            return sendDissapearingMessage(message, `You didn't specify any number my friend ${message.author}!`);
        }
        if (args[0] > 100) {
            return sendDissapearingMessage(message, `You cannot delete more than 100 messages my friend ${message.author}!`);
        }
        if (args[0] < 1) {
            return sendDissapearingMessage(message, `You must delete at least one message my friend ${message.author}!`);
        }

        let embed = new Discord.MessageEmbed().setColor(COLORS.red);
        const messages = await message.channel.messages.fetch({ limit: args[0] });
        try {
            await message.channel.bulkDelete(messages);
            embed = new Discord.MessageEmbed()
                .setDescription(`${messages.size} Messages Deleted By ${message.author}`)
                .setColor(COLORS.green);
            logger.info(`${messages.size} Messages Deleted By ${message.author.tag}`);
        } catch (e) {
            embed = new Discord.MessageEmbed().setDescription('Messages older than 2 weeks cannot be deleted').setColor(COLORS.red);
        }
        return message.channel.send(embed);
    },
};
