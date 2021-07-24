const Discord = require("discord.js");
const { addToTreatList } = require("../firebase/firebase_handler");
const { prefix } = require("../utils/functions");

module.exports = {
    name: "treatlist-add",
    usage: `${prefix}treatlist-add <@user_name> <reason>`,
    description: "Adds the user to treatlist with given reason",

    /**
     * @param {Discord.Message} message
     * @param {string[]} args
     */
    async execute(message, args) {
        if (args.length < 2) return message.channel.send(`Check your arguments, ${message.author}!`);
        else {
            const tag_user = message.mentions.users.first();
            if (!tag_user) return message.channel.send(`You didn't tag a user, ${message.author}!`);

            args.splice(0, 1);
            const description = args.join(" ").trim();
            await addToTreatList(message, tag_user, description);

            const member = message.guild.member(tag_user);
            const embed = new Discord.MessageEmbed()
                .setColor(member.roles.color.hexColor)
                .setFooter(description, tag_user.displayAvatarURL())
                .setTitle(`${member.user.tag} added to treat list`)
            return message.channel.send(embed);
        }
    },
};
