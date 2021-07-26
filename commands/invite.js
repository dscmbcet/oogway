const Discord = require('discord.js');
const { colors, prefix } = require('../utils/constants');
const { sendDissapearingMessage } = require('../utils/functions');

module.exports = {
    name: 'invite',
    usage: `${prefix}invite <NAME>`,
    description: 'Creates an invite for NAME',

    /*
  TODO: EMAIL
  usage: `${prefix}invite <USERNAME> [EMAIL]`,
  description: "Creates an invite for USERNAME, and sends the code to EMAIL",
  */

    /**
     * @param {Discord.Message} message
     * @param {string[]} args
     * @param {Discord.Client} client
     */
    async execute(message, args, client) {
        if (args.length != 1) return sendDissapearingMessage(message, `You didn't specify any username, ${message.author}!`);
        else {
            let embed = new Discord.MessageEmbed({
                title: `I am sorry you are not wise enough to invite someone here`,
                color: colors.red,
            });
            if (!message.member.hasPermission('CREATE_INSTANT_INVITE')) return message.channel.send(embed);

            const username = args[0];
            const email = args[1];
            const welcome_channel_name = client.configs.get(message.guild.id).welcome_channel_name;
            const channel = message.guild.channels.cache.find(ch => ch.name === welcome_channel_name);
            const invtite = await channel.createInvite({
                maxUses: 1,
                unique: true,
                reason: `For username:${username}`,
            });

            embed = new Discord.MessageEmbed()
                .setTitle(`Invite Created`)
                .addField('Link', invtite.url)
                .addField('Expires', invtite.expiresAt.toDateString(), true)
                .addField('Person', `\`${username}\`\n${!email ? '' : email}`, true)
                .setColor(colors.cyan);

            return message.channel.send(embed);
        }
    },
};
