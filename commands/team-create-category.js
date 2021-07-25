const Discord = require('discord.js');
const { addReactionRole } = require('../firebase/firebase_handler');
const colors = require('../utils/colors');
const { prefix, team_emojis, findRoleById, REACTION_TYPE } = require('../utils/functions');

module.exports = {
    name: 'team-create-category',
    usage: `${prefix}team-create-category <TEAM_NO> <CATEGORY_NAME>`,
    description:
        'Creates category CATEGORY_NAME with given no. of TEAM_NO as sub channels for voice and text and creates role for each team',

    /**
     * @param {Discord.Message} message
     * @param {string[]} args
     * @param {Discord.Client} client
     */
    async execute(message, args, client) {
        if (args.length < 2) return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
        else {
            let team_data = [],
                embed;

            if (!message.member.hasPermission('ADMINISTRATOR')) {
                embed = new Discord.MessageEmbed({
                    description: `You are not wise enough to make those channels my friend** ${message.member}**`,
                    color: colors.red,
                });
                return message.channel.send(embed);
            }

            const TEAM_NO = args[0];
            if (TEAM_NO > team_emojis.length) {
                embed = new Discord.MessageEmbed({
                    title: `Team Number Can't Be Greater Than ${team_emojis.length}`,
                    color: colors.red,
                });
                return message.channel.send(embed);
            }
            args.splice(0, 1);
            const CATEGORY_NAME = args.join(' ').trim().toLocaleUpperCase();

            const server_config = client.configs.get(message.guild.id);
            const core_team_role = findRoleById(message, server_config.core_team_role_id);

            const general_permissions = [
                {
                    id: core_team_role.id,
                    allow: core_team_role.permissions,
                },
                {
                    id: message.guild.roles.everyone,
                    deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'CONNECT'],
                },
            ];

            const role = message.guild.roles;
            const channel = message.guild.channels;

            const categoryRole = await role.create({ data: { name: CATEGORY_NAME, color: 'BLACK' } });
            const memberRolePermissions = findRoleById(message, server_config.new_member_default_role_id).permissions;

            const category = await channel.create(CATEGORY_NAME, {
                type: 'category',
                permissionOverwrites: [
                    {
                        id: categoryRole.id,
                        allow: memberRolePermissions,
                    },
                    ...general_permissions,
                ],
            });

            /** @type {Discord.Channel} */
            const annoucementChannel = await channel.create(`announcements`, {
                type: 'text',
                parent: category.id,
                permissionOverwrites: [
                    {
                        id: categoryRole.id,
                        allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
                        deny: ['SEND_MESSAGES'],
                    },
                    ...general_permissions,
                ],
            });

            for (let i = 1; i <= TEAM_NO; i++) {
                const team_role = await role.create({
                    data: {
                        name: `team ${i}`,
                        color: 'RANDOM',
                    },
                });

                const team_permission = [
                    {
                        id: team_role.id,
                        allow: memberRolePermissions,
                    },
                    ...general_permissions,
                ];

                const team_channel = await channel.create(`team ${i}`, {
                    type: 'text',
                    parent: category.id,
                    permissionOverwrites: team_permission,
                });

                await channel.create(`team ${i}`, {
                    type: 'voice',
                    parent: category.id,
                    permissionOverwrites: team_permission,
                });

                team_data.push({ channel: team_channel, role: team_role });
            }

            embed = new Discord.MessageEmbed({
                title: 'Created Category Succesfully',
                description: `${CATEGORY_NAME} with ${TEAM_NO} teams}`,
                color: colors.green,
            });

            await message.reply(embed);

            let desc = [];
            for (let i = 0; i < TEAM_NO; i++) desc.push(`${team_data[i].role} :  ${team_emojis[i]}\n`);

            let reaction_embed = new Discord.MessageEmbed({
                title: 'React the following emojis to get roles',
                description: desc.join('\n'),
                color: colors.orange,
            });

            let reaction_msg = await annoucementChannel.send(reaction_embed);
            for (let i = 0; i < TEAM_NO; i++) await reaction_msg.react(team_emojis[i]);

            await addReactionRole(reaction_msg, team_data, REACTION_TYPE.TEAM);
        }
    },
};
