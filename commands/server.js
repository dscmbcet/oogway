const Discord = require("discord.js");
module.exports = {
  name: "server",
  usage: "!server",
  description: "Gives information about the server",

  /**
   * @param {Discord.Message} message The Message
   * @param {string[]} args The arguments
   */
  async execute(message, args) {
    let info = [
      {
        name: "Server Name",
        value: message.guild.name,
      },
      {
        name: "Total members",
        value: message.guild.memberCount,
      },
      {
        name: "Server Region",
        value: message.guild.region,
      },
      {
        name: "Categories",
        value: message.guild.channels.cache.filter((e) => e.type == "category")
          .size,
      },
      {
        name: "Text Channels",
        value: message.guild.channels.cache.filter((e) => e.type == "text")
          .size,
      },
      {
        name: "Voice Channels",
        value: message.guild.channels.cache.filter((e) => e.type == "voice")
          .size,
      },
    ];
    let embed = new Discord.MessageEmbed({
      title: "Server Information",
      fields: info,
      color: 0xffa500,
      thumbnail: {
        url: message.guild.iconURL(),
      },
    });
    message.channel.send({ embed });
  },
};