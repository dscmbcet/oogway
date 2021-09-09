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
        const moderator = message.member.permissions.has('MANAGE_GUILD');
        const commandFiles = fs.readdirSync('./commands/').filter((file) => file.endsWith('.js'));

        const commandsArray = commandFiles
            .map((file) => {
                const command = require(`./${file}`);
                if (command.admin && !moderator) return 'ADMIN_ONLY';
                if (command.hidden) return 'HIDDEN';
                return {
                    name: command.name,
                    value: [
                        `\`${command.usage === undefined ? '-' : command.usage}\``,
                        `${command.description === undefined ? '-' : command.description}`,
                    ].join('\n'),
                };
            })
            .filter((command) => command !== 'ADMIN_ONLY')
            .filter((command) => command !== 'HIDDEN');

        commandsArray.sort();

        const embed = new Discord.MessageEmbed({
            title: 'Commands',
            color: COLORS.purple,
            fields: commandsArray,
        });

        return message.channel.send(embed);
    },
};
