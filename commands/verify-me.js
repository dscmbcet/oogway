const Discord = require('discord.js');
const { PREFIX } = require('../utils/constants');
const { sendVerify } = require('../events/guildMemberAdd');

module.exports = {
    name: 'verify-me',
    usage: `${PREFIX}verify-me`,
    description: 'Verify yourself at server',

    /**
     * @param {Discord.Message} message
     */
    async execute(message) {
        const member = message.guild.member(message.author.id);
        await sendVerify(member, message.channel);
    },
};
