// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js');
const { PREFIX, COLORS } = require('../utils/constants');
const { sendVerify } = require('../events/guildMemberAdd');
const { getMember } = require('../firebase/firebase_handler');

module.exports = {
    name: 'verify-me',
    usage: `${PREFIX}verify-me`,
    description: 'Verify yourself at server',

    /**
     * @param {Discord.Message} message
     */
    async execute(message) {
        const member = message.guild.member(message.author.id);
        const embed = new Discord.MessageEmbed()
            .setTitle('Verification')
            .setColor(COLORS.red)
            .setDescription(`You are already verified ${member.user}`);

        const tempUser = await getMember(member);
        if (tempUser.verified) return message.channel.send(embed);
        await sendVerify(member, message.channel);
    },
};
