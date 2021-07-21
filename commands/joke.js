const Discord = require("discord.js");
const fetch = require('node-fetch');
const API_URL = require("../utils/api_urls");
const colors = require("../utils/colors");

module.exports = {
  name: "joke",
  usage: "!joke",
  description: "Tells a joke for you",

  /**
   * @param {Discord.Message} message The Message
   * @param {string[]} args The arguments
   */
  async execute(message, args) {
    let embed;
    try {
      const response = await fetch(API_URL.joke)
      const data = await response.json();
      embed = new Discord.MessageEmbed({
        title: `Here is your joke for the day`,
        description: data.joke,
        color: colors.cyan,
      });
      return message.channel.send({ embed });
    } catch (e) {
      embed = new Discord.MessageEmbed({
        title: `No Jokes For Now`,
        color: colors.red,
      });
      return message.channel.send({ embed });
    }
  },
};
