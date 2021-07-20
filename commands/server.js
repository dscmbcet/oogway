const Discord = require('discord.js');
module.exports = {
    name: 'server',
    usage: '!server',
    description: 'Gives Information About Given Args',

    /**
    * @param {Discord.Message} message The Message
    * @param {string[]} args The arguments
    */
    async execute(message, args) {
        message.channel.send(
            `Server Name: ${message.guild.name} \n Total members: ${message.guild.memberCount} \n No: of channels : ${message.guild.member} \n Server Region ${message.guild.region}`
        );
    }
}