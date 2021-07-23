const Discord = require("discord.js");
const { prefix } = require("../utils/functions");
const fs = require("fs");
const colors = require("../utils/colors");

module.exports = {
  name: "help",
  usage: `${prefix}help`,
  description: "Gives basic information about commands",

  /**
   * @param {Discord.Message} message
   * @param {string[]} args
   */
  async execute(message, args) {
    const commandFiles = fs
      .readdirSync("./commands/")
      .filter((file) => file.endsWith(".js"));

    let commandsArray = commandFiles.map((file) => {
      const command = require(`./${file}`);
      return `\`${command.usage === undefined ? "-" : command.usage}\``;
    });

    commandsArray.sort();
    let embed = new Discord.MessageEmbed({
      title: `Command Usage`,
      color: colors.purple,
      description: commandsArray.join("\n"),
    });
    message.channel.send({ embed });
  },
};
