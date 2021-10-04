const Discord = require('discord.js');
const { PREFIX, COLORS } = require('../utils/constants');
const { sendDissapearingMessage } = require('../utils/functions');

module.exports = {
    name: 'role-remove',
    admin: true,
    usage: `${PREFIX}role-remove <@role_name> <@username> [..@username_N]`,
    description: 'Removes the given role_name from given users',

    /**
     * @param {Discord.Message} message
     * @param {string[]} args
     */
    async execute(message) {
        if (!message.member.hasPermission('MANAGE_ROLES')) {
            return sendDissapearingMessage(message, `You are not wise enough to make that call my friend ${message.author}`);
        }
        if (!message.mentions.roles.first()) return sendDissapearingMessage(message, `You didn't tag a role, ${message.author}!`);
        if (!message.mentions.users.first()) return sendDissapearingMessage(message, `You didn't tag a user, ${message.author}!`);

        try {
            const { id: roleID, name: roleName } = message.mentions.roles.first();
            const embed = new Discord.MessageEmbed().setColor(COLORS.green).setTitle(`Removed the '@${roleName}' role from users`);
            const users = message.mentions.users.array();

            users.forEach((user) => {
                const userRoles = message.guild.members.cache.get(user.id).roles;
                userRoles.remove(roleID);
            });

            return message.channel.send(embed);
        } catch {
            return sendDissapearingMessage(message, `You mentioned a invalid role, ${message.author}`);
        }
    },
};
