const Discord = require('discord.js');
const { PREFIX, COLORS } = require('../utils/constants');
const { findChannelByName, findRoleById, sendDissapearingMessage } = require('../utils/functions');

module.exports = {
    name: 'team-delete-category',
    usage: `${PREFIX}team-delete-category <CATEGORY_NAME>`,
    description: 'Deletes category CATEGORY_NAME with all its sub channels and roles',

    /**
     * @param {Discord.Message} message
     * @param {string[]} args
     */
    async execute(message, args) {
        if (!message.member.hasPermission('MANAGE_CHANNELS')) {
            return sendDissapearingMessage(message, `You are not wise enough to make those channels my friend ${message.author}`);
        }
        if (!args.length) {
            return sendDissapearingMessage(message, `Check your arguments, ${message.author}!`);
        }

        const CATEGORY_NAME = args.join(' ').trim().toLocaleUpperCase();

        /** @type {Discord.CategoryChannel} */
        const category = findChannelByName(message, CATEGORY_NAME);
        if (!category) {
            return message.reply(
                new Discord.MessageEmbed({
                    title: 'Check your category name',
                    color: COLORS.red,
                })
            );
        }

        category.children.forEach(async (channel) => {
            channel.permissionOverwrites.forEach(async (role) => {
                const teamRole = findRoleById(message, role.id);
                if (!teamRole) return;
                if (teamRole.name === channel.name) {
                    await teamRole.delete();
                    return true;
                }
            });
            await channel.delete();
        });

        category.permissionOverwrites.forEach(async (role) => {
            const categoryRole = findRoleById(message, role.id);
            if (!categoryRole) return;
            if (categoryRole.name === CATEGORY_NAME) {
                await categoryRole.delete();
                return true;
            }
        });
        await category.delete();

        const embed = new Discord.MessageEmbed({
            title: `Deleted ${CATEGORY_NAME} Category Succesfully`,
            color: COLORS.red,
        });

        message.reply(embed);
    },
};
