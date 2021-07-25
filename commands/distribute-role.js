const Discord = require('discord.js');
const colors = require('../utils/colors');
const { prefix, findRoleById, findBestMessageSize } = require('../utils/functions');

module.exports = {
    name: 'distribute-role',
    usage: `${prefix}distribute-role <@role_name> <TEAM_NO>`,
    description: 'Distributes the users belonging to given role into TEAM_NO of teams',

    /**
     * @param {Discord.Message} message
     * @param {string[]} args
     */
    async execute(message, args) {
        if (args.length < 2) return message.channel.send(`Check your arguments, ${message.author}!`);
        else {
            let embed = new Discord.MessageEmbed();
            let team_no = args[1];
            if (isNaN(team_no)) return message.channel.send(`You didn't specify a number, ${message.author}!`);

            try {
                team_no = parseInt(team_no);
                if (team_no <= 0) return message.channel.send(`Specify a greater number, ${message.author}!`);
                const { id: roleID, name: roleName } = message.mentions.roles.first();
                const role = findRoleById(message, roleID);

                embed.setColor(role.hexColor);

                let users = role === undefined ? ['No Role Found'] : role.members.array();
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

                for (let i = 0, j = 1; i < users.length; i += distribute_no, j++) {
                    const team_members = users.slice(i, Math.min(users.length, i + distribute_no));
                    teams.push({
                        team_name: `Team ${j}`,
                        members: team_members,
                    });
                }

                //Remaining people
                for (let i = users.length - remaining, j = 0; i < users.length; i++, j++) {
                    const member = users.slice(i);
                    teams[j].members.push(member);
                }

                let messageSend = [`**Distributed Teams For Role ${message.mentions.roles.first()}**`];
                teams.forEach(team => {
                    messageSend.push(`\n\`${team.team_name}\`\n\n${team.members.join('\n')}`);
                });

                return await message.channel.send(messageSend.join('\n'), { split: true });
            } catch (e) {
                console.log(e);
                embed.setTitle(`Invalid Role`).setColor(colors.red);
                return message.channel.send(embed);
            }
        }
    },
};
