const Discord = require("discord.js");
module.exports = {
  name: "find-user",
  usage: "!find-user @user_name",
  description: "Gives information about given user",

  /**
   * @param {Discord.Message} message The Message
   * @param {string[]} args The arguments
   */
  async execute(message, args) {
    if (!args.length)
      return message.channel.send(`You didn't tag a user, ${message.author}!`);
    else {
      const taggedUser = message.mentions.users.first();
      const member = message.guild.member(taggedUser);
      const joinedDate = new Date(member.joinedAt);
      const joinedDateFormatted = `${joinedDate.getDate()}-${
        joinedDate.getMonth() + 1
      }-${joinedDate.getFullYear()}`;
      const formattedMessage = [
        `**User ID**: ${member.id}`,
        `**Display Name**: ${member.displayName}`,
        `**Nickname**: ${member.nickname == null ? "-" : member.nickname}`,
        `**Highest Role**: ${member.roles.highest.name}`,
        `**Joined sever on**: ${joinedDateFormatted}`,
      ];

      const embed = new Discord.MessageEmbed({
        description: formattedMessage.join("\n"),
        color: 0xffff,
        thumbnail: {
          url: member.user.displayAvatarURL(),
        },
        hexColor: member.roles.color.hexColor,
      });

      return message.channel.send({ embed });
    }
  },
};