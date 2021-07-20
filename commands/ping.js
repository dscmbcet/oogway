const Discord = require('discord.js');
module.exports = {
    name: 'ping',
    usage: '!ping',
    description: 'Command to ping the bot',

    /**
    * @param {Discord.Message} message The Message
    * @param {string[]} args The arguments
    */
    async execute(message, args) {
        let embed = new Discord.MessageEmbed({
            description: `Hello **${message.author.username}**`,
            color: 'RANDOM'
        });
        message.channel.send({ embed });
    }
}