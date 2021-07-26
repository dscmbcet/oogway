const Discord = require('discord.js');
const { colors, prefix } = require('../utils/constants');
const { findRoleById } = require('../utils/functions');

module.exports = {
    name: 'distribute-role-name',
    usage: `${prefix}distribute-role-name <@role_name> <TEAM_NO>`,
    description: 'Distributes the users (username) belonging to given role into TEAM_NO of teams',

    /**
     * @param {Discord.Message} message
     * @param {string[]} args
     */
    async execute(message, args) {
        if (args.length != 2) return message.channel.send(`Check your arguments, ${message.author}!`);
        if (!message.mentions.roles.first()) return message.channel.send(`You didn't tag a role, ${message.author}!`);
        else {
            let embed = new Discord.MessageEmbed();
            let team_no = parseInt(args[1]);
            if (isNaN(team_no)) return message.channel.send(`You didn't specify a number, ${message.author}!`);

            try {
                if (team_no <= 0) return message.channel.send(`Specify a greater number, ${message.author}!`);
                const { id: roleID, name: roleName } = message.mentions.roles.first();
                const role = findRoleById(message, roleID);

                embed.setColor(role.hexColor);

                let users = role === undefined ? ['No Role Found'] : role.members.map(e => e.displayName);
                users = users.length == undefined || users.length == 0 ? 'No User Found' : users;

                if (users == 'No User Found') {
                    embed.title(`No Users with the '@${roleName}' role`);
                    return message.channel.send(embed);
                }

                users = users.sort(() => Math.random() - 0.5); //Shuffling users

                const distribute_no = Math.floor(users.length / team_no);
                const remaining = users.length % team_no;
                let teams = [];

                if (distribute_no <= 0)
                    return message.channel.send(
                        `Specify a lesser number, ${message.author}!\nMembers Size : ${users.length}`
                    );

                for (let i = 0, j = 1; i < users.length - remaining; i += distribute_no, j++) {
                    const team_members = users.slice(i, Math.min(users.length, i + distribute_no));
                    teams.push({
                        team_name: `Team ${j}`,
                        members: team_members,
                    });
                }

                //Remaining people
                for (let i = users.length - remaining, j = 0; i < users.length; i++, j++) {
                    teams[j].members.push(users[i]);
                }

                let messageSend = [
                    `**Distributed Teams For Role ${message.mentions.roles.first()}**\n**Members Size: ${users.length
                    }**`,
                ];
                teams.forEach(team => {
                    messageSend.push(`\n\`${team.team_name} : ${team.members.length}\`\n\n${team.members.join('\n')}`);
                });

                return await message.channel.send(messageSend.join('\n'), { split: true });
            } catch {
                embed.setTitle(`Invalid Role`).setColor(colors.red);
                return message.channel.send(embed);
            }
        }
    },
};
