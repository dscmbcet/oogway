const Discord = require('discord.js');
const { treatDataArray } = require('../firebase/treat');
const { PREFIX, COLORS } = require('../utils/constants');

module.exports = {
    name: 'treatlist',
    usage: `${PREFIX}treatlist`,
    description: 'Gives the current treatlist',

    /**
     * @param {Discord.Message} message
     * @param {string[]} args
     * @param {Discord.Client} client
     */
    async execute(message, args, client) {
        let toSend = treatDataArray
            .map((e) => {
                const guild = client.guilds.cache.get(e.guild_id);
                const user = guild.members.cache.get(e.user_id).displayName;
                return `\`${user}\` : ${e.description}`;
            })
            .join('\n');

        if (!toSend) toSend = 'No one yet';
        const embed = new Discord.MessageEmbed().setTitle('Treat List').setColor(COLORS.orange).setDescription(toSend);
        return message.channel.send(embed);
    },
};
