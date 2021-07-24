const Discord = require("discord.js");
const { prefix } = require("../utils/functions");
const colors = require("../utils/colors");

module.exports = {
  name: "clear",
  usage: `${prefix}clear <NUMBER>`,
  description: "Clear upto 100 messages",

  /**
   * @param {Discord.Message} message
   * @param {string[]} args
   */
  async execute(message, args) {
    let embed = new Discord.MessageEmbed().setColor(colors.red);
    if (!message.member.hasPermission('ADMINISTRATOR')) { return message.channel.send(embed.setDescription(`You are not wise enough to do that ${message.author}`)) }
    if (!args[0] || isNaN(args[0])) return message.channel.send(embed.setDescription(`You didn't specify any number my friend ${message.author}!`));
    if (args[0] > 100) return message.channel.send(embed.setDescription(`You cannot delete more than 100 messages my friend ${message.author}!`));
    if (args[0] < 1) return message.channel.send(embed.setDescription(`You must delete at least one message my friend ${message.author}!`));

    const messages = await message.channel.messages.fetch({ limit: args[0] });
    try {
      await message.channel.bulkDelete(messages);
      embed = new Discord.MessageEmbed()
        .setDescription(`${messages.size} Messages Deleted By ${message.author}`)
        .setColor(colors.green);
    } catch (e) {
      embed = new Discord.MessageEmbed()
        .setDescription(`Messages older than 2 weeks cannot be deleted`)
        .setColor(colors.red);
    }
    return message.channel.send(embed);
  }
}
