const Discord = require("discord.js");
const colors = require("../utils/colors");
const { findBestMessageSize, findRoleById } = require("../utils/functions");

module.exports = {
  name: "find-role",
  usage: "!find-role @role_name",
  description: "Gives the usernames,date of joining of members belonging to given role",

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
        const role = findRoleById(message, roleID);
        let users = role === undefined
          ? ["No Role Found"]
          : role.members
            .sort((a, b) => a.joinedAt - b.joinedAt)
            .map(m => `${m.displayName}  \`${m.joinedAt.toDateString()}\` `);

        users = users.length == undefined || users.length == 0
          ? "No User Found"
          : users;

        const BEST_LENGTH = findBestMessageSize(users);
        console.log(BEST_LENGTH);
        console.log(users);
        for (let i = 0; i < users.length; i += BEST_LENGTH) {
          const toSend = users.slice(i, Math.min(users.length, i + BEST_LENGTH)).join("\n");
          let embed;
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

      } catch (e) {
        embed = new Discord.MessageEmbed({
          title: `Invalid Role`,
          color: colors.red,
        });
        return message.channel.send({ embed, split: true });
      }
    }
  }
};
