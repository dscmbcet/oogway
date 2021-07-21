const Discord = require("discord.js");
const Oogway_quotes = require("../utils/oogwayQuotes");

module.exports = {
  name: "master",
  usage: "!master",
  description: "summon Master Oogway",

  /**
   * @param {Discord.Message} message The Message
   * @param {string[]} args The arguments
   */
  async execute(message, args) {
    const quote = Oogway_quotes[Math.floor(Math.random() * Oogway_quotes.length)];
    const member = message.guild.member(message.author.id);

    let embed = new Discord.MessageEmbed({
      description: `${quote}\n\nHow are you doing my friend **${member}**`,
      color: member.displayHexColor,
    });
    message.channel.send({ embed });
  },
};
