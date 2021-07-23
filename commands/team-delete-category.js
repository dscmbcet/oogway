const Discord = require("discord.js");
const colors = require("../utils/colors");
const { findRoleByName, findChannelByName } = require("../utils/functions");

module.exports = {
    name: "team-delete-category",
    usage: "!team-delete-category <CATEGORY_NAME>",
    description: "Deletes category CATEGORY_NAME with all its sub channels and roles",

    /**
     * @param {Discord.Message} message The Message
     * @param {string[]} args The arguments
     */
    async execute(message, args) {
        if (!args.length)
            return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
        else {
            if (!message.member.hasPermission('ADMINISTRATOR')) {
                embed = new Discord.MessageEmbed({
                    description: `You are not wise enough to delete those channels my friend** ${member}**`,
                    color: colors.red,
                })
                return message.channel.send({ embed });
            }

            const CATEGORY_NAME = args.join(" ");

            /**@type {Discord.CategoryChannel}*/
            const category = findChannelByName(message, CATEGORY_NAME);
            if (!category) return message.reply(new Discord.MessageEmbed({
                title: `Check your category name`,
                color: colors.red,
            }));

            category.children.forEach(async channel => {
                const team_role = findRoleByName(message, channel.name);
                if (team_role) await team_role.delete();
                await channel.delete()
            });

            const role = findRoleByName(message, CATEGORY_NAME)
            if (role) await role.delete();
            await category.delete();

            let embed = new Discord.MessageEmbed({
                title: `Deleted Category Succesfully`,
                color: colors.red,
            });
            message.reply(embed);
        }
    },
};
