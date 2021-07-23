const Discord = require("discord.js");
const colors = require("../utils/colors");
const { findRoleByName } = require("../utils/functions");

module.exports = {
    name: "team-create-category",
    usage: "!team-create-category <TEAM_NO> <CATEGORY_NAME>",
    description: "Creates category CATEGORY_NAME with given no. of TEAM_NO as sub channels having roles and text and creates role for each team",

    /**
     * @param {Discord.Message} message The Message
     * @param {string[]} args The arguments
     */
    async execute(message, args) {
        if (args.length < 2)
            return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
        else {
            if (!message.member.hasPermission('ADMINISTRATOR')) {
                embed = new Discord.MessageEmbed({
                    description: `You are not wise enough to make those channels my friend** ${member}**`,
                    color: colors.red,
                })
                return message.channel.send({ embed });
            }

            const core_team_permission = {
                id: findRoleByName(message, 'Core Team').id,
                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'CONNECT', 'CHANGE_NICKNAME', 'MUTE_MEMBERS', 'PRIORITY_SPEAKER', 'MOVE_MEMBERS']
            }


            const TEAM_NO = args[0];
            args.splice(0, 1);
            const CATEGORY_NAME = args.join(" ");

            const { create: createRole } = message.guild.roles;
            const { create: createChannel } = message.guild.channels;

            const CateogoryRole = await createRole({
                data: {
                    name: CATEGORY_NAME,
                    color: 'BLACK',
                },
            })

            const catergory = await createChannel(CATEGORY_NAME, {
                type: 'category',
                permissionOverwrites: [
                    {
                        id: CateogoryRole.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'CONNECT']
                    },
                    {
                        id: message.guild.roles.everyone,
                        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'CONNECT']
                    },
                    core_team_permission
                ]
            });

            const annoucementChannel = await createChannel(`announcements`, {
                type: 'text',
                parent: catergory.id,
                permissionOverwrites: [
                    {
                        id: CateogoryRole.id,
                        allow: ['VIEW_CHANNEL'],
                        deny: ['SEND_MESSAGES']
                    },
                    {
                        id: message.guild.roles.everyone,
                        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'CONNECT']
                    },
                    core_team_permission
                ]
            });


            for (let i = 1; i <= TEAM_NO; i++) {
                const role = await createRole({
                    data: {
                        name: `team ${i}`,
                        color: 'RANDOM',
                    },
                })

                const permission = [
                    {
                        id: role.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'CONNECT']
                    },
                    {
                        id: message.guild.roles.everyone,
                        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'CONNECT']
                    },
                    core_team_permission
                ]

                await createChannel(`team ${i}`, {
                    type: 'text',
                    parent: catergory.id,
                    permissionOverwrites: permission
                });

                await createChannel(`team ${i}`, {
                    type: 'voice',
                    parent: catergory.id,
                    permissionOverwrites: permission
                });
            }

            let embed = new Discord.MessageEmbed({
                title: "Created Category Succesfully",
                color: colors.green,
            });

            // TODO: Create reaction embed according to roles
            let reaction_embed = new Discord.MessageEmbed({
                title: "Reaction Embed : TODO",
                color: colors.cyan,
            });

            await message.reply(embed);
            return annoucementChannel.send(reaction_embed);
        }
    },
};
