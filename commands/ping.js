const Discord = require("discord.js");
module.exports = {
  name: "ping",
  usage: "!ping",
  description: "Command to ping the bot",

  /**
   * @param {Discord.Message} message The Message
   * @param {string[]} args The arguments
   */
  async execute(message, args) {
    const member = message.guild.member(message.author.id);
    let embed = new Discord.MessageEmbed({
      description: `How are you doing my old friend **${member}**`,
      color: member.displayHexColor,
    });
    message.channel.send({ embed });
  },
};
