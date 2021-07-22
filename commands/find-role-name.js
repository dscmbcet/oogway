const Discord = require("discord.js");
const colors = require("../utils/colors");

module.exports = {
  name: "find-role-name",
  usage: "!find-role-name @role_name",
  description: "Gives the usernames of members belonging to given role",

  /**
   * @param {Discord.Message} message The Message
   * @param {string[]} args The arguments
   */
  async execute(message, args) {
    if (!args.length)
      return message.channel.send(
        `You didn't specify any role, ${message.author}!`
      );
    else {
      let embed;
      try {
        const { id: roleID, name: roleName } = message.mentions.roles.first();
        const role = message.guild.roles.cache.find(e_role => e_role.id === roleID);
        let users = role === undefined
          ? ["No Role Found"]
          : role.members
            .map(m => m.displayName);

        users = users.length == undefined || users.length == 0
          ? "No User Found"
          : users;

        const BEST_LENGTH = this.findBestMessageSize(users);
        for (let i = 0; i < users.length; i += BEST_LENGTH) {
          const toSend = users.slice(i, Math.min(users.length, i + BEST_LENGTH)).join("\n");
          if (i === 0)
            embed = new Discord.MessageEmbed({
              title: `Users with the '@${roleName}' role`,
              color: role.hexColor,
              description: toSend
            });
          else {
            embed = new Discord.MessageEmbed({
              color: role.hexColor,
              description: toSend
            });
          }
          await message.channel.send(embed);
        }

        return;
      } catch {
        embed = new Discord.MessageEmbed({
          title: `Invalid Role`,
          color: colors.red,
        });
        return message.channel.send({ embed, split: true });
      }
    }
  },

  /**
   *  @param {string[]} data String Data Array
   * @returns {number} BEST_LENGTH
   * */
  findBestMessageSize(data) {
    let BEST_LENGTH = 0;
    while (true) {
      const orginalSize = data.slice(0, data.length).join("\n").length;
      const size = data.slice(0, Math.min(data.length, BEST_LENGTH)).join("\n").length;
      if (orginalSize <= 3500) {
        BEST_LENGTH = orginalSize;
        break;
      }
      if (size >= 3500) {
        BEST_LENGTH -= 1;
        break;
      }
      BEST_LENGTH += 1;
    }
    return BEST_LENGTH;
  }
};
