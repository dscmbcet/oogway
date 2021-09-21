const Discord = require('discord.js');
const { COLORS, PREFIX } = require('../utils/constants');
const { sendDissapearingMessage } = require('../utils/functions');
const { logger } = require('../utils/logger');

module.exports = {
    name: 'ban',
    admin: true,
    usage: `${PREFIX}ban <@user-name> <reason>`,
    description: 'Bans a member from server',

    /**
     * @param {Discord.Message} message
     * @param {string[]} args
     */
    async execute(message, args) {
        const member = message.guild.member(message.author.id);

        if (!message.member.hasPermission('BAN_MEMBERS')) {
            return sendDissapearingMessage(message, `You are not wise enough to make that call my friend ${member}`);
        }

        args = args.filter((e) => e !== '');
        if (!message.mentions.users.first()) return sendDissapearingMessage(message, `You need to tag someone! ${member}`);
        if (args.length < 2) return sendDissapearingMessage(message, `Whats the reason? ${member}`);

        const embed = new Discord.MessageEmbed();
        const tagUser = message.mentions.users.first();
        const taggedUser = message.guild.member(tagUser);

        args = args.splice(1);
        const reason = args.join(' ');

        if (member === taggedUser) {
            embed.setDescription(`Why do you want to ban yourself my friend ${member}`).setColor(COLORS.red);
        } else {
            try {
                try {
                    await taggedUser.send(
                        [
                            `Dear ${taggedUser},`,
                            'We have noticed you are not following our guidelines properly',
                            'As mentioned earlier we will not tolerate any kind of misbehaviour,',
                            'Your are being `KICKED` from **GDSC MBCET**',
                        ].join('\n')
                    );
                } catch (error) {}
                await taggedUser.ban({ reason, days: 7 });

                embed.setTitle(`${tagUser.tag} has been banned`);
                embed.setFooter(`Reason: ${reason}`, taggedUser.user.displayAvatarURL()).setColor(COLORS.cyan);
                logger.info(`${tagUser.tag} has been banned`);
            } catch {
                embed.setFooter(`I am sorry but that person is wiser than you my friend ${member}`).setColor(COLORS.red);
            }
        }
        return message.channel.send(embed);
    },
};
