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
        const moderator = message.member.permissions.has('MANAGE_GUILD');
        const commandFiles = fs.readdirSync('./commands/').filter((file) => file.endsWith('.js'));

        const commandsArray = commandFiles
            .map((file) => {
                const command = require(`./${file}`);
                if (command.admin && !moderator) return 'ADMIN_ONLY';
                if (command.hidden) return 'HIDDEN';
                return `\`${command.usage === undefined ? '-' : command.usage}\``;
            })
            .filter((command) => command !== 'ADMIN_ONLY' || command !== 'HIDDEN');

        commandsArray.sort();
        const embed = new Discord.MessageEmbed({
            title: 'Command Usage',
            color: COLORS.purple,
            description: commandsArray.join('\n'),
        });
        message.channel.send({ embed });
    },
};
