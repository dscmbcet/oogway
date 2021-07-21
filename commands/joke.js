const Discord = require("discord.js");
const https = require("https");
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
    let embed, joke;
    try {
      const url =
        "https://v2.jokeapi.dev/joke/Programming?blacklistFlags=nsfw,religious,political,racist,sexist,explicit&type=single";

      https
        .get(url, (res) => {
          let body = "";
          res.on("data", (chunk) => {
            body += chunk;
          });

          res.on("end", () => {
            let json = JSON.parse(body);
            embed = new Discord.MessageEmbed({
              title: `Here is your joke for the day`,
              description: json.joke,
              color: colors.cyan,
            });
            return message.channel.send({ embed });
          });
        })
        .on("error", (error) => {
          throw error;
        });
    } catch (e) {
      embed = new Discord.MessageEmbed({
        title: `No Jokes For Now`,
        color: colors.red,
      });
      return message.channel.send({ embed });
    }
  },
};
