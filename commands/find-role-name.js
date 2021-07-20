const Discord = require("discord.js");
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
      // eslint-disable-next-line no-shadow
      let embed;
      try {
        const roleID = message.mentions.roles.first().id;
        const roleName = message.mentions.roles.first().name;
        const role = message.guild.roles.cache.find(
          (e_role) => e_role.id === roleID
        );
        let users =
          role === undefined
            ? ["No Role Found"]
            : role.members
              .map((m) => m.displayName);

        users =
          users.length == undefined || users.length == 0
            ? "No User Found"
            : users;

        let BEST_LENGTH = 0;
        while (true) {
          const size = users.slice(0, Math.min(users.length, BEST_LENGTH)).join("\n").length;
          if (size >= 3500) {
            BEST_LENGTH -= 1;
            break;
          }
          BEST_LENGTH += 1;
        }

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

      } catch (e) {
        console.log('Error:find-role :', e);
        embed = new Discord.MessageEmbed({
          title: `Invalid Role`,
          color: 0xffff,
        });
        return message.channel.send({ embed, split: true });
      }
    }
  },
};
