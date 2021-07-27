const Discord = require('discord.js');
const { PREFIX } = require('../utils/constants');
const { findRoleById, findBestMessageSize, sendDissapearingMessage } = require('../utils/functions');

module.exports = {
    name: 'find-role-name',
    usage: `${PREFIX}find-role-name <@role_name>`,
    description: 'Gives the usernames of members belonging to given role',

    /**
     * @param {Discord.Message} message
     */
    async execute(message) {
        if (!message.mentions.roles.first()) return sendDissapearingMessage(message, `You didn't tag a role, ${message.author}!`);

        const embed = new Discord.MessageEmbed();
        try {
            const { id: roleID, name: roleName } = message.mentions.roles.first();
            const role = findRoleById(message, roleID);
            embed.setColor(role.hexColor);

            let users = role === undefined ? ['No Role Found'] : role.members.map((m) => m.displayName);
            users = users.length === undefined || users.length === 0 ? 'No User Found' : users;

            if (users === 'No User Found') {
                embed.title(`No Users with the '@${roleName}' role`);
                return message.channel.send(embed);
            }

            const BEST_LENGTH = findBestMessageSize(users);
            for (let i = 0; i < users.length; i += BEST_LENGTH) {
                const toSend = users.slice(i, Math.min(users.length, i + BEST_LENGTH)).join('\n');
                embed.setDescription(toSend);
                if (i === 0) embed.setTitle(`Users with the '@${roleName}' role`);
                // eslint-disable-next-line no-await-in-loop
                await message.channel.send(embed);
            }
        } catch {
            return sendDissapearingMessage(message, `You mentioned a invalid role, ${message.author}`);
        }
    },
};
