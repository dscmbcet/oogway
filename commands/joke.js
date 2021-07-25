const Discord = require('discord.js');
const fetch = require('node-fetch');
const { colors, API_URL, prefix } = require('../utils/constants');

module.exports = {
    name: 'joke',
    usage: `${prefix}joke`,
    description: 'Tells a joke for you',

    /**
     * @param {Discord.Message} message
     * @param {string[]} args
     */
    async execute(message, args) {
        let embed = new Discord.MessageEmbed();
        try {
            const response = await fetch(API_URL.joke);
            const data = await response.json();
            embed.setTitle(`Here is your joke for the day`).setDescription(data.joke).setColor(colors.cyan);
            return message.channel.send(embed);
        } catch (e) {
            embed.setTitle(`No Jokes For Now`).setColor(colors.red);
            return message.channel.send({ embed });
        }
    },
};
