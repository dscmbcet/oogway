const Discord = require('discord.js'); // eslint-disable-line no-unused-vars
const fs = require('fs');
const { PREFIX } = require('../utils/constants');

module.exports = {
    name: 'help-v',
    usage: `${PREFIX}help-v`,
    description: 'Gives detailed information about commands',

    /**
     * @param {Discord.Message} message
     */
    async execute(message) {
        const admins = message.member.permissions.has('ADMINISTRATOR');
        const commandFiles = fs.readdirSync('./commands/').filter((file) => file.endsWith('.js'));

        const commandsArray = commandFiles
            .map((file) => {
                const command = require(`./${file}`);
                const description = {
                    name: command.name,
                    value: [
                        `\`${command.usage === undefined ? '-' : command.usage}\``,
                        `${command.description === undefined ? '-' : command.description}`,
                    ].join('\n'),
                };

                if (command.hidden) return 'HIDDEN';
                if (command.admin && admins) return description;
                if (command.admin) return 'DELETE';
                return description;
            })
            .filter((command) => command !== 'DELETE')
            .filter((command) => command !== 'HIDDEN');

        commandsArray.sort();
        const msg = `**Commands Usage**\n\n${commandsArray.map((e) => `${e?.value}\n`).join('\n')}`;
        return message.channel.send(msg, { split: true });
    },
};
