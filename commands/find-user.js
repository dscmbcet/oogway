const Discord = require("discord.js");

module.exports = {
  name: "find-user",
  usage: "!find-user @user_name",
  description: "Gives information about given user",

  /**
   * @param {Discord.Message} message
   * @param {string[]} args
   */
  async execute(message, args) {
    if (!args.length) return message.channel.send(`You didn't tag a user, ${message.author}!`);
    else {
      const tagged_user = message.guild.member(message.mentions.users.first());
      const formattedMessage = [
        `**User ID**: ${tagged_user.id}`,
        `**Display Name**: ${tagged_user.displayName}`,
        `**Nickname**: ${tagged_user.nickname == null ? "-" : tagged_user.nickname}`,
        `**Highest Role**: ${tagged_user.roles.highest.name}`,
        `**Joined sever on**: ${tagged_user.joinedAt.toDateString()}`,
      ];

      const embed = new Discord.MessageEmbed({
        description: formattedMessage.join("\n"),
        thumbnail: { url: tagged_user.user.displayAvatarURL() },
        color: tagged_user.roles.color.hexColor,
      });

      return message.channel.send({ embed });
    }
  },
};
