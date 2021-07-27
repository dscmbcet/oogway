const Discord = require('discord.js');
const fetch = require('node-fetch');
const { API_URL, PREFIX } = require('../utils/constants');

module.exports = {
    name: 'master',
    usage: `${PREFIX}master`,
    description: 'Summon Master Oogway To Gather Knowledge',

    /**
     * @param {Discord.Message} message
     * @param {string[]} args
     */
    async execute(message) {
        const member = message.guild.member(message.author.id);
        try {
            const response = await fetch(API_URL.quotes);
            const data = await response.json();
            const embed = new Discord.MessageEmbed({
                description: `“${data.content}”\n- ${data.author}\n\nHow are you doing my friend **${member}**`,
                color: member.displayHexColor,
            });
            return message.channel.send(embed);
        } catch (e) {
            const embed = new Discord.MessageEmbed({
                description: `How are you doing my friend **${member}**`,
                color: member.displayHexColor,
            });
            return message.channel.send(embed);
        }
    },
};
