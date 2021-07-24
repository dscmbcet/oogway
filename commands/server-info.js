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
    const { name, memberCount, region, channels, roles } = message.guild;
    const channelData = channels.cache;
    let embed = new Discord.MessageEmbed()
      .setTitle("Server Information")
      .setColor(colors.orange)
      .setThumbnail(message.guild.iconURL())
      .addField("Server Name", name, true)
      .addField("Total members", memberCount, true)
      .addField("Server Region", region, true)
      .addField("Categories", channelData.filter(channel => channel.type == "category").size, true)
      .addField("Text Channels", channelData.filter(channel => channel.type == "text").size, true)
      .addField("Voice Channels", channelData.filter(channel => channel.type == "voice").size, true)
      .addField("Roles", roles.cache.map(roles => `${roles}`).sort().join(' '));
    return message.channel.send(embed);
  },
};
