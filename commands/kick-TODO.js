const Discord = require("discord.js");
module.exports = {
  name: "kick",
  usage: "!kick @user-name",
  description: "Kicks a member from server",

  /**
   * @param {Discord.Message} message The Message
   * @param {string[]} args The arguments
   */
  async execute(message, args) {
    if (!message.mentions.users.size)
      return message.reply("You need to tag someone!");
    else {
      const taggedUser = message.mentions.users.first();
      message.channel.send(`You wanted to kick : ${taggedUser.username}`);
    }
  },
};
