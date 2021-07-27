const Discord = require('discord.js');
const fs = require('fs');
const { PREFIX, COLORS } = require('../utils/constants');

module.exports = {
    name: 'help-v',
    usage: `${PREFIX}help-v`,
    description: 'Gives detailed information about commands',

    /**
     * @param {Discord.Message} message
     */
    async execute(message) {
        const commandFiles = fs.readdirSync('./commands/').filter((file) => file.endsWith('.js'));

        const commandsArray = commandFiles.map((file) => {
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

        const embed = new Discord.MessageEmbed({
            title: 'Commands',
            color: COLORS.purple,
            fields: commandsArray,
        });

        return message.channel.send(embed);
    },
};
