const Discord = require("discord.js");
const colors = require("../utils/colors");

module.exports = {
    name: "team-delete-channel",
    usage: "!team-delete-channel <CHANNEL_NAME>",
    description: "Deletes Channel <CHANNEL_NAME> with all its sub channels and roles",

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

            const CHANNEL_NAME = args.join(" ");
            const category = await message.guild.channels.cache.find(cat => cat.name === CHANNEL_NAME);
            category.children.forEach(async channel => {
                const team_role = await message.guild.roles.cache.find(rol => rol.name === channel.name);
                if (team_role) await team_role.delete();
                await channel.delete()
            });

            const role = await message.guild.roles.cache.find(rol => rol.name === CHANNEL_NAME);
            if (role) await role.delete();
            await category.delete();

            let embed = new Discord.MessageEmbed({
                title: `Deleted Channel Succesfully`,
                color: colors.red,
            });
            message.reply(embed);
        }
    },
};
