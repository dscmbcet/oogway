const Discord = require("discord.js");
module.exports = {
  name: "find-role",
  usage: "!find-role @role_name",
  description: "Gives the UserNames of members belonging to given role",

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
            : role.members.map((m) => m.displayName).sort();

        users =
          users.length == undefined || users.length == 0
            ? "No User Found"
            : users.join("\n");
        embed = new Discord.MessageEmbed({
          title: `Users with the '@${roleName}' role`,
          description: users,
          color: 0xffff,
        }).setColor(role.hexColor);
      } catch {
        embed = new Discord.MessageEmbed({
          title: `Invalid Role`,
          color: 0xffff,
        });
      }

      return message.channel.send({ embed });
    }
  },
};
