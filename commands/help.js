const Discord = require("discord.js");
const fs = require("fs");
const colors = require("../utils/colors");

module.exports = {
  name: "help",
  usage: "!help",
  description: "gives basic information about commands",

  /**
   * @param {Discord.Message} message The Message
   * @param {string[]} args The arguments
   */
  async execute(message, args) {
    const commandFiles = fs
      .readdirSync("./commands/")
      .filter((file) => file.endsWith(".js"));
    let infoArr = commandFiles.map((file) => {
      const command = require(`./${file}`);
      return `\`${command.usage === undefined ? "-" : command.usage}\``;
    });

    infoArr.sort();
    let embed = new Discord.MessageEmbed({
      title: `Command Usage`,
      color: colors.purple,
      description: infoArr.join("\n"),
    });
    message.channel.send({ embed });
  },
};
