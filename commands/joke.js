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
        const embed = new Discord.MessageEmbed().setTitle('Here is your joke for the day').setColor(COLORS.cyan);
        try {
            const response = await fetch(API_URL.joke);
            const data = await response.json();
            if (data.type === 'single') {
                embed.setDescription(data.joke);
            } else {
                embed.setDescription(`${data.setup}\n${data.delivery}`);
            }
            return message.channel.send(embed);
        } catch (e) {
            return sendDissapearingMessage(message, 'Sorry No Jokes For Now');
        }
    },
};
