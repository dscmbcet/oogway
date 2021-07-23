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
    const { name, memberCount, region, channels } = message.guild;
    let info = [
      {
        name: "Server Name",
        value: name,
      },
      {
        name: "Total members",
        value: memberCount,
      },
      {
        name: "Server Region",
        value: region,
      },
      {
        name: "Categories",
        value: channels.cache.filter(channel => channel.type == "category").size,
      },
      {
        name: "Text Channels",
        value: channels.cache.filter(channel => channel.type == "text").size,
      },
      {
        name: "Voice Channels",
        value: channels.cache.filter(channel => channel.type == "voice").size,
      }
    ];
    let embed = new Discord.MessageEmbed({
      title: "Server Information",
      fields: info,
      color: colors.orange,
      thumbnail: { url: message.guild.iconURL() },
    });
    message.channel.send({ embed });
  },
};
