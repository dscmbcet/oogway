const Discord = require("discord.js");
const colors = require("../utils/colors");

module.exports = {
  name: "ban-user",
  usage: "!ban-user @user-name",
  description: "Bans a member from server",

  /**
   * @param {Discord.Message} message The Message
   * @param {string[]} args The arguments
   */
  async execute(message, args) {

    const member = message.guild.member(message.author.id);
    let embed;

    if (!message.member.hasPermission('BAN_MEMBERS')) {
      embed = new Discord.MessageEmbed({
        description: `You are not wise enough to make that call my friend** ${member}**`,
        color: colors.red,
      })
      return message.channel.send({ embed });
    }

    if (!message.mentions.users.size) {
      embed = new Discord.MessageEmbed({
        description: `You need to tag someone! ${member}`,
        color: member.displayHexColor,
      });
    }
    else {
      const taggedUser = message.guild.member(message.mentions.users.first());

      if (member == taggedUser) {
        embed = new Discord.MessageEmbed({
          description: `Why do you want to ban yourself my friend** ${member}**`,
          color: colors.red,
        });
      }
      else {
        try {
          await taggedUser.ban();
          embed = new Discord.MessageEmbed({
            footer: {
              text: `${taggedUser.displayName} has been banned`,
              icon_url: taggedUser.user.displayAvatarURL(),
            },
            color: colors.cyan,
          });
        } catch (e) {
          embed = new Discord.MessageEmbed({
            description: `I am sorry but that person is wiser than you my friend** ${member}**`,
            color: colors.red,
          })
        }
      }
    }

    return message.channel.send({ embed });
  },
};
