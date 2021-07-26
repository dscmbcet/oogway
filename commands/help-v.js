const Discord = require('discord.js');
const fs = require('fs');
const { colors, prefix } = require('../utils/constants');
const { logger } = require('../utils/logger');

module.exports = {
    name: 'help-v',
    usage: `${prefix}help-v`,
    description: 'Gives detailed information about commands',

    /**
     * @param {Discord.Message} message
     * @param {string[]} args
     */
    async execute(message, args) {
        const commandFiles = fs.readdirSync('./commands/').filter(file => file.endsWith('.js'));

        let commandsArray = commandFiles.map(file => {
            const command = require(`./${file}`);
            return {
                name: command.name,
                value: [
                    `\`${command.usage === undefined ? '-' : command.usage}\``,
                    `${command.description === undefined ? '-' : command.description}`,
                ].join('\n'),
            };
        });

        commandsArray.sort();

        let embed = new Discord.MessageEmbed({
            title: `Commands`,
            color: colors.purple,
            fields: commandsArray,
        });

        return message.channel.send(embed);
    },
};
