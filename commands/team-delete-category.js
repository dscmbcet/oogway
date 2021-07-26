const Discord = require('discord.js');
const { colors, prefix } = require('../utils/constants');
const { findChannelByName, findRoleById } = require('../utils/functions');

module.exports = {
    name: 'team-delete-category',
    usage: `${prefix}team-delete-category <CATEGORY_NAME>`,
    description: 'Deletes category CATEGORY_NAME with all its sub channels and roles',

    /**
     * @param {Discord.Message} message
     * @param {string[]} args
     */
    async execute(message, args) {
        if (!message.member.hasPermission('ADMINISTRATOR'))
            return sendDissapearingMessage(message, `You are not wise enough to make those channels my friend ${member}`);
        else if (!args.length) return sendDissapearingMessage(message, `Check your arguments, ${message.author}!`);
        else {
            let embed;
            const CATEGORY_NAME = args.join(' ').trim().toLocaleUpperCase();

            /**@type {Discord.CategoryChannel}*/
            const category = findChannelByName(message, CATEGORY_NAME);
            if (!category)
                return message.reply(
                    new Discord.MessageEmbed({
                        title: `Check your category name`,
                        color: colors.red,
                    })
                );

            category.children.forEach(async channel => {
                channel.permissionOverwrites.forEach(async role => {
                    const team_role = findRoleById(message, role.id);
                    if (!team_role) return;
                    if (team_role.name === channel.name) return await team_role.delete();
                });
                await channel.delete();
            });

            category.permissionOverwrites.forEach(async role => {
                const category_role = findRoleById(message, role.id);
                if (!category_role) return;
                if (category_role.name === CATEGORY_NAME) return await category_role.delete();
            });
            await category.delete();

            embed = new Discord.MessageEmbed({
                title: `Deleted ${CATEGORY_NAME} Category Succesfully`,
                color: colors.red,
            });

            message.reply(embed);
        }
    },
};
