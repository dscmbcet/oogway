const Discord = require("discord.js");
const fs = require("fs");
module.exports = {
  name: "help-v",
  usage: "!help-v",
  description: "Gives detailed information about commands",

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
      return {
        name: command.name,
        value: [
          `Usage: \`${command.usage === undefined ? "-" : command.usage}\``,
          `Description: ${
            command.description === undefined ? "-" : command.description
          }`,
        ].join("\n"),
      };
    });

    infoArr.sort();

    let embed = new Discord.MessageEmbed({
      title: `Commands Verbose`,
      color: 0xff0000,
      fields: infoArr,
    });
    message.channel.send({ embed });
  },
};
