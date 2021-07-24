const Discord = require("discord.js");
const colors = require("../utils/colors");
const { prefix, findRoleById, findBestMessageSize } = require("../utils/functions");

module.exports = {
  name: "find-role-name",
  usage: `${prefix}find-role-name <@role_name>`,
  description: "Gives the usernames of members belonging to given role",

  /**
   * @param {Discord.Message} message
   * @param {string[]} args
   */
  async execute(message, args) {
    if (!args.length) return message.channel.send(`You didn't specify any role, ${message.author}!`);
    else {
      let embed = new Discord.MessageEmbed();
      try {
        const { id: roleID, name: roleName } = message.mentions.roles.first();
        const role = findRoleById(message, roleID);
        embed.setColor(role.hexColor);

        let users = role === undefined ? ["No Role Found"] : role.members.map(m => m.displayName);
        users = users.length == undefined || users.length == 0 ? "No User Found" : users;

        if (users == "No User Found") {
          embed.title(`No Users with the '@${roleName}' role`);
          return message.channel.send(embed);
        }

        const BEST_LENGTH = findBestMessageSize(users);
        for (let i = 0; i < users.length; i += BEST_LENGTH) {
          const toSend = users.slice(i, Math.min(users.length, i + BEST_LENGTH)).join("\n");
          embed.setDescription(toSend);
          if (i === 0) embed.setTitle(`Users with the '@${roleName}' role`)
          await message.channel.send(embed);
        }

        return;
      } catch {
        embed
          .setTitle(`Invalid Role`)
          .setColor(colors.red);
        return message.channel.send(embed);
      }
    }
  }
};
