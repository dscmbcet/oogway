const Discord = require('discord.js');
const fs = require('fs');
const { PREFIX, COLORS } = require('../utils/constants');

module.exports = {
    name: 'help',
    usage: `${PREFIX}help`,
    description: 'Gives basic information about commands',

    /**
     * @param {Discord.Message} message
     */
    async execute(message) {
        const commandFiles = fs.readdirSync('./commands/').filter((file) => file.endsWith('.js'));

        const commandsArray = commandFiles.map((file) => {
            const command = require(`./${file}`);
            return `\`${command.usage === undefined ? '-' : command.usage}\``;
        });

        commandsArray.sort();
        const embed = new Discord.MessageEmbed({
            title: 'Command Usage',
            color: COLORS.purple,
            description: commandsArray.join('\n'),
        });
        message.channel.send({ embed });
    },
};
