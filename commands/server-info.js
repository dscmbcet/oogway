const Discord = require("discord.js");
const { prefix } = require("../utils/functions");
const colors = require("../utils/colors");

module.exports = {
  name: "server-info",
  usage: `${prefix}server-info`,
  description: "Gives information about the server",

  /**
   * @param {Discord.Message} message
   * @param {string[]} args
   */
  async execute(message, args) {
    const { name, memberCount, region, channels, roles, owner, id, members, premiumSubscriptionCount } = message.guild;
    let embed = new Discord.MessageEmbed()
      .setTitle("Server Information")
      .setColor(colors.orange)
      .setThumbnail(message.guild.iconURL())
      .addField("Server Name", name, true)
      .addField("Server ID", id, true)
      .addField("Server Owner", owner, true)
      .addField("Server Region", region, true)
      .addField("Boost Count", premiumSubscriptionCount || '0', true)
      .addField("Roles", roles.cache.size, true)
      .addField("Total members", memberCount, true)
      .addField("Humans", members.cache.filter(member => !member.user.bot).size, true)
      .addField("Bots", members.cache.filter(member => member.user.bot).size, true)
      .addField("Categories", channels.cache.filter(channel => channel.type == "category").size, true)
      .addField("Text Channels", channels.cache.filter(channel => channel.type == "text").size, true)
      .addField("Voice Channels", channels.cache.filter(channel => channel.type == "voice").size, true)

    return message.channel.send(embed);
  },
};
