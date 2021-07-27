const Discord = require('discord.js');
const fetch = require('node-fetch');
const { API_URL, PREFIX, COLORS } = require('../utils/constants');
const { sendDissapearingMessage } = require('../utils/functions');

module.exports = {
    name: 'joke',
    usage: `${PREFIX}joke`,
    description: 'Tells a joke for you',

    /**
     * @param {Discord.Message} message
     */
    async execute(message) {
        const embed = new Discord.MessageEmbed();
        try {
            const response = await fetch(API_URL.joke);
            const data = await response.json();
            embed.setTitle('Here is your joke for the day').setDescription(data.joke).setColor(COLORS.cyan);
            return message.channel.send(embed);
        } catch (e) {
            return sendDissapearingMessage(message, 'Sorry No Jokes For Now');
        }
    },
};
