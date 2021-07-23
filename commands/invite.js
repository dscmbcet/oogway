const Discord = require("discord.js");
const { welcome_channel_name } = require("../config");
const colors = require("../utils/colors");

module.exports = {
  name: "invite",
  usage: "!invite <USERNAME> [EMAIL]",
  description: "Creates an invite for USERNAME, and sends email the code to EMAIL",

  /**
   * @param {Discord.Message} message 
   * @param {string[]} args 
   * @param {Discord.Client} client
   */
  async execute(message, args, client) {
    if (args.length < 1) return message.channel.send(`You didn't specify any username, ${message.author}!`);
    else {
      let embed = new Discord.MessageEmbed({
        title: `I am sorry you are not wise enough to invite someone here`,
        color: colors.red,
      });
      if (!message.member.hasPermission('CREATE_INSTANT_INVITE')) return message.channel.send(embed)

      const username = args[0];
      const email = args[1];
      const channel = message.guild.channels.cache.find((ch) => ch.name === welcome_channel_name);
      const invtite = await channel.createInvite({
        maxUses: 1,
        unique: true,
        reason: `For username:${username}`
      })

      embed = new Discord.MessageEmbed({
        title: `Invite Created`,
        fields: [
          {
            name: 'Link',
            value: invtite.url
          },
          {
            name: 'Expires',
            value: invtite.expiresAt.toDateString()
          },
          {
            name: 'Person',
            value: `\`${username}\`\n${!email ? '' : email}`
          }
        ],
        color: colors.green
      });

      return message.channel.send(embed);
    }

  }
};
