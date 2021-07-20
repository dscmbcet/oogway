const Discord = require('discord.js');
module.exports = {
    name: 'args-info',
    usage: '!args-info',
    description: 'Gives Information About Args',

    /**
    * @param {Discord.Message} message The Message
    * @param {string[]} args The arguments
    */
    async execute(message, args) {
        if (!args.length)
            return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
        else
            message.channel.send(`Arguments: ${args}`);
    }
}