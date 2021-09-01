const Discord = require('discord.js');
const { PREFIX, COLORS } = require('../utils/constants');
const { sendDissapearingMessage } = require('../utils/functions');
const { logger } = require('../utils/logger');

module.exports = {
    name: 'invite',
    usage: `${PREFIX}invite <NAME>`,
    description: 'Creates an invite for NAME',

    /*
  TODO: EMAIL
  usage: `${PREFIX}invite <USERNAME> [EMAIL]`,
  description: "Creates an invite for USERNAME, and sends the code to EMAIL",
  */

    /**
     * @param {Discord.Message} message
     * @param {string[]} args
     * @param {Discord.Client} client
     */
    async execute(message, args, client) {
        if (args.length < 1) return sendDissapearingMessage(message, `You didn't specify any username, ${message.author}!`);

        let embed = new Discord.MessageEmbed({
            title: 'I am sorry you are not wise enough to invite someone here',
            color: COLORS.red,
        });
        if (!message.member.hasPermission('CREATE_INSTANT_INVITE')) return message.channel.send(embed);

        const username = args.join(' ');
        const email = '';
        const channel = message.guild.channels.cache.get(client.configs.get(message.guild.id).welcome_channel_id);
        try {
            const invtite = await channel.createInvite({
                maxUses: 1,
                unique: true,
                reason: `For username:${username}`,
            });

            embed = new Discord.MessageEmbed()
                .setTitle('Invite Created')
                .addField('Link', invtite.url)
                .addField('Expires', invtite.expiresAt.toDateString(), true)
                .addField('Person', `\`${username}\`\n${!email ? '' : email}`, true)
                .setColor(COLORS.cyan);

            logger.info(`Invite Created For ${username}`);
            return message.channel.send(embed);
        } catch (error) {
            return logger.debug(error);
        }
    },
};
