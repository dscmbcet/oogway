const Discord = require("discord.js");
const colors = require("../utils/colors");

module.exports = {
    name: "team-create-category",
    usage: "!team-create-category <TEAM_NO> <CATEGORY_NAME>",
    description: "creates category CATEGORY_NAME with given no. of TEAM_NO as sub channels having roles and text and creates role for each team",

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

            const TEAM_NO = args[0];
            args.splice(0, 1);
            const CATEGORY_NAME = args.join(" ");

            const CateogoryRole = await message.guild.roles.create({
                data: {
                    name: CATEGORY_NAME,
                    color: 'BLACK',
                },
            })

            const catergory = await message.guild.channels.create(CATEGORY_NAME, {
                type: 'category',
                permissionOverwrites: [
                    {
                        id: CateogoryRole.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'CONNECT']
                    },
                    {
                        id: message.guild.roles.everyone,
                        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'CONNECT']
                    }
                ]
            })

            for (let i = 1; i <= TEAM_NO; i++) {
                const role = await message.guild.roles.create({
                    data: {
                        name: `team ${i}`,
                        color: 'RANDOM',
                    },
                })

                await message.guild.channels.create(`team ${i}`, {
                    type: 'text',
                    parent: catergory.id,
                    permissionOverwrites: [
                        {
                            id: role.id,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'CONNECT']
                        },
                        {
                            id: message.guild.roles.everyone,
                            deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'CONNECT']
                        }
                    ]
                });

                await message.guild.channels.create(`team ${i}`, {
                    type: 'voice',
                    parent: catergory.id,
                    permissionOverwrites: [
                        {
                            id: role.id,
                            allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'CONNECT']
                        },
                        {
                            id: message.guild.roles.everyone,
                            deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'CONNECT']
                        }
                    ]
                });
            }

            const annoucementChannel = await message.guild.channels.create(`announcements`, {
                type: 'text',
                position: 1,
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
                    }
                ]
            });

            let embed = new Discord.MessageEmbed({
                title: "Created Category Succesfully",
                color: colors.green,
            });

            let reaction_embed = new Discord.MessageEmbed({
                title: "Reaction Embed : TODO",
                color: colors.cyan,
            });

            await message.reply(embed);
            await annoucementChannel.send(reaction_embed);
        }
    },
};
