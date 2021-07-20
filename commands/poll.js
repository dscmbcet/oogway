const Discord = require("discord.js");
module.exports = {
  name: "poll",
  usage: "!poll NUMBER TITLE DESCRIPTION",
  description:
    "Creates a poll of given _NUMBER_ with a title _TITLE_ and a _DESCRIPTION_",

  /**
   * @param {Discord.Message} message The Message
   * @param {string[]} args The arguments
   */
  async execute(message, args) {
    if (args.length < 2)
      return message.channel.send(`Invalid Syntax, ${message.author}!`);
    else {
      // eslint-disable-next-line no-shadow
      let embed;
      let emojiArr = [
        "1️⃣",
        "2️⃣",
        "3️⃣",
        "4️⃣",
        "5️⃣",
        "6️⃣",
        "7️⃣",
        "8️⃣",
        "9️⃣",
        "🔟",
      ];
      const poll_no = args[0];

      args.splice(0, 1);
      const description = args.join(" ");

      if (poll_no == 0)
        embed = new Discord.MessageEmbed({
          title: `POLL : Can't Be Zero`,
          color: 0xeb0707,
        });
      else if (poll_no > emojiArr.length)
        embed = new Discord.MessageEmbed({
          title: `POLL : Can't Be Greater Than ${emojiArr.length}`,
          color: 0xeb0707,
        });
      else
        embed = new Discord.MessageEmbed({
          title: `Poll`,
          description: `**${description}**\n\n_Created by @${message.author.username}_`,
          color: 0xeb9e34,
        });

      const embedMessage = await message.channel.send({ embed });
      if (!(poll_no === 0 || poll_no > emojiArr.length)) {
        for (let i = 0; i < poll_no; i++) await embedMessage.react(emojiArr[i]);
      }
    }
  },
};
