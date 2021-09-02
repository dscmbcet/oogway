const Discord = require('discord.js');
const { PREFIX } = require('../utils/constants');
const { findRoleById, sendDissapearingMessage } = require('../utils/functions');

module.exports = {
    name: 'distribute-role-name',
    usage: `${PREFIX}distribute-role-name <TEAM_NO> <@role_name>`,
    description: 'Distributes the users (username) belonging to given role into TEAM_NO of teams',

    /**
     * @param {Discord.Message} message
     * @param {string[]} args
     */
    async execute(message, args) {
        if (args.length !== 2) return sendDissapearingMessage(message, `Check your arguments, ${message.author}!`);
        if (!message.mentions.roles.first()) return sendDissapearingMessage(message, `You didn't tag a role, ${message.author}!`);

        const teamNo = parseInt(args[0], 10);
        if (Number.isNaN(teamNo)) return sendDissapearingMessage(message, `You didn't specify a number, ${message.author}!`);
        if (teamNo <= 0) return sendDissapearingMessage(message, `Specify a greater number, ${message.author}!`);

        try {
            const embed = new Discord.MessageEmbed();
            const { id: roleID, name: roleName } = message.mentions.roles.first();
            const role = findRoleById(message, roleID);

            embed.setColor(role.hexColor);

            let users = role === undefined ? ['No Role Found'] : role.members.map((e) => e.displayName);
            users = users.length === undefined || users.length === 0 ? 'No User Found' : users;

            if (users === 'No User Found') {
                embed.title(`No Users with the '@${roleName}' role`);
                return message.channel.send(embed);
            }

            users = users.sort(() => Math.random() - 0.5); // Shuffling users

            const distributeNo = Math.floor(users.length / teamNo);
            const remaining = users.length % teamNo;
            const teams = [];

            if (distributeNo <= 0) {
                return message.channel.send(`Specify a lesser number, ${message.author}!\nMembers Size : ${users.length}`);
            }

            for (let i = 0, j = 1; i < users.length - remaining; i += distributeNo, j++) {
                const teamMembers = users.slice(i, Math.min(users.length, i + distributeNo));
                teams.push({
                    team_name: `Team ${j}`,
                    members: teamMembers,
                });
            }

            // Remaining people
            for (let i = users.length - remaining, j = 0; i < users.length; i++, j++) {
                teams[j].members.push(users[i]);
            }

            const messageSend = [`**Distributed Teams For Role ${message.mentions.roles.first()}**\n**Members Size: ${users.length}**`];
            teams.forEach((team) => {
                messageSend.push(`\n\`${team.team_name} : ${team.members.length}\`\n\n${team.members.join('\n')}`);
            });

            return await message.channel.send(messageSend.join('\n'), { split: true });
        } catch {
            return sendDissapearingMessage(message, `You mentioned a invalid role, ${message.author}`);
        }
    },
};
