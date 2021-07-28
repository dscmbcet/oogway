const Discord = require('discord.js');
const { addReactionRole } = require('../firebase/firebase_handler');
const { PREFIX, COLORS, TEAM_EMOJIS, REACTION_TYPE } = require('../utils/constants');
const { findRoleById, sendDissapearingMessage } = require('../utils/functions');

module.exports = {
    name: 'team-create-category',
    usage: `${PREFIX}team-create-category <TEAM_NO> <CATEGORY_NAME>`,
    description:
        'Creates category CATEGORY_NAME with given no. of TEAM_NO as sub channels for voice and text and creates role for each team',

    /**
     * @param {Discord.Message} message
     * @param {string[]} args
     * @param {Discord.Client} client
     */
    async execute(message, args, client) {
        const TEAM_NO = parseInt(args[0], 10);
        if (!message.member.hasPermission('ADMINISTRATOR')) {
            return sendDissapearingMessage(message, `You are not wise enough to make those channels my friend ${message.author}`);
        }
        if (args.length < 2) {
            return sendDissapearingMessage(message, `Check your arguments, ${message.author}!`);
        }
        if (Number.isNaN(TEAM_NO)) {
            return sendDissapearingMessage(message, `You didn't specify a number, ${message.author}!`);
        }
        if (TEAM_NO > TEAM_EMOJIS.length) {
            return sendDissapearingMessage(message, `Team Number Can't Be Greater Than ${TEAM_EMOJIS.length}, ${message.author}!`);
        }

        const teamData = [];

        args.splice(0, 1);
        const CATEGORY_NAME = args.join(' ').trim().toLocaleUpperCase();

        const serverConfig = client.configs.get(message.guild.id);
        const coreTeamRole = findRoleById(message, serverConfig.core_team_role_id);

        const generalPermissions = [
            {
                id: coreTeamRole.id,
                allow: coreTeamRole.permissions,
            },
            {
                id: message.guild.roles.everyone,
                deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'CONNECT'],
            },
        ];

        const role = message.guild.roles;
        const channel = message.guild.channels;

        const categoryRole = await role.create({ data: { name: CATEGORY_NAME, color: 'BLACK' } });
        const memberRolePermissions = findRoleById(message, serverConfig.new_member_default_role_id).permissions;

        const category = await channel.create(CATEGORY_NAME, {
            type: 'category',
            permissionOverwrites: [
                {
                    id: categoryRole.id,
                    allow: memberRolePermissions,
                },
                ...generalPermissions,
            ],
        });

        /** @type {Discord.Channel} */
        const annoucementChannel = await channel.create('announcements', {
            type: 'text',
            parent: category.id,
            permissionOverwrites: [
                {
                    id: categoryRole.id,
                    allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
                    deny: ['SEND_MESSAGES'],
                },
                ...generalPermissions,
            ],
        });

        for (let i = 1; i <= TEAM_NO; i++) {
            const teamRole = await role.create({
                data: {
                    name: `team ${i}`,
                    color: 'RANDOM',
                },
            });

            const teamPermission = [
                {
                    id: teamRole.id,
                    allow: memberRolePermissions,
                },
                ...generalPermissions,
            ];

            const teamChannel = await channel.create(`team ${i}`, {
                type: 'text',
                parent: category.id,
                permissionOverwrites: teamPermission,
            });

            await channel.create(`team ${i}`, {
                type: 'voice',
                parent: category.id,
                permissionOverwrites: teamPermission,
            });

            teamData.push({ channel: teamChannel, role: teamRole });
        }

        const embed = new Discord.MessageEmbed({
            title: 'Created Category Succesfully',
            description: `${CATEGORY_NAME} with ${TEAM_NO} teams`,
            color: COLORS.green,
        });

        await message.reply(embed);

        const desc = [];
        for (let i = 0; i < TEAM_NO; i++) desc.push(`${teamData[i].role} :  ${TEAM_EMOJIS[i]}\n`);

        const reactionEmbed = new Discord.MessageEmbed({
            title: 'React the following emojis to get roles',
            description: desc.join('\n'),
            color: COLORS.orange,
        });

        const reactionMessage = await annoucementChannel.send(reactionEmbed);
        for (let i = 0; i < TEAM_NO; i++) await reactionMessage.react(TEAM_EMOJIS[i]);

        const parsedData = teamData.map((e) => ({ role: e.role.id, channel: e.channel.id }));
        await addReactionRole(reactionMessage, parsedData, REACTION_TYPE.TEAM);
    },
};
