const Discord = require("discord.js");
const { core_team_role_name } = require("../config");
const colors = require("../utils/colors");
const { prefix, findRoleByName } = require("../utils/functions");

module.exports = {
    name: "team-create-category",
    usage: `${prefix}team-create-category <TEAM_NO> <CATEGORY_NAME>`,
    description: "Creates category CATEGORY_NAME with given no. of TEAM_NO as sub channels having roles and text and creates role for each team",

    /**
     * @param {Discord.Message} message
     * @param {string[]} args
     * @param {Discord.Client} client
     */
    async execute(message, args, client) {
        if (args.length < 2)
            return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
        else {
            let emojiArr = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟", "❤️", "🧡", "💛", "💚", "💙", "💜", "🤎", "🖤", "🤍"], embed;

            if (!message.member.hasPermission('ADMINISTRATOR')) {
                embed = new Discord.MessageEmbed({
                    description: `You are not wise enough to make those channels my friend** ${member}**`,
                    color: colors.red,
                })
                return message.channel.send(embed);
            }

            const TEAM_NO = args[0];
            if (TEAM_NO > emojiArr.length) {
                embed = new Discord.MessageEmbed({
                    title: `Team Number Can't Be Greater Than ${emojiArr.length}`,
                    color: colors.red,
                });
                return message.channel.send(embed);
            }
            args.splice(0, 1);
            const CATEGORY_NAME = args.join(" ");

            const core_team_permission = {
                id: findRoleByName(message, core_team_role_name).id,
                allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'CONNECT', 'CHANGE_NICKNAME', 'MUTE_MEMBERS', 'PRIORITY_SPEAKER', 'MOVE_MEMBERS']
            }

            const role = message.guild.roles;
            const channel = message.guild.channels;

            const CateogoryRole = await role.create({
                data: {
                    name: CATEGORY_NAME,
                    color: 'BLACK',
                },
            })

            const catergory = await channel.create(CATEGORY_NAME, {
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

            /** @type {Discord.Channel} */
            const annoucementChannel = await channel.create(`announcements`, {
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

            let team_data = []
            for (let i = 1; i <= TEAM_NO; i++) {
                const team_role = await role.create({
                    data: {
                        name: `team ${i}`,
                        color: 'RANDOM',
                    },
                });

                const permission = [
                    {
                        id: team_role.id,
                        allow: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'CONNECT']
                    },
                    {
                        id: message.guild.roles.everyone,
                        deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'CONNECT']
                    },
                    core_team_permission
                ]

                const team_channel = await channel.create(`team ${i}`, {
                    type: 'text',
                    parent: catergory.id,
                    permissionOverwrites: permission
                });

                await channel.create(`team ${i}`, {
                    type: 'voice',
                    parent: catergory.id,
                    permissionOverwrites: permission
                });

                team_data.push({ channel: team_channel, role: team_role });
            }

            embed = new Discord.MessageEmbed({
                title: "Created Category Succesfully",
                color: colors.green,
            });

            await message.reply(embed);

            let desc = [];
            for (let i = 0; i < TEAM_NO; i++) desc.push(`Team ${i + 1} :  ${emojiArr[i]}\n`);

            let reaction_embed = new Discord.MessageEmbed({
                title: "React the following emojis to get roles",
                description: desc.join('\n'),
                color: colors.orange,
            });

            let reaction_msg = await annoucementChannel.send(reaction_embed);
            for (let i = 0; i < TEAM_NO; i++) await reaction_msg.react(emojiArr[i]);

            client.on('messageReactionAdd', async (reaction, user) => {
                if (reaction.message.partial) await reaction.message.fetch();
                if (reaction.partial) await reaction.fetch();
                if (user.bot) return;

                if (reaction.message.channel.id == annoucementChannel.id) {
                    const team_no = emojiArr.findIndex(e => e === reaction.emoji.name);
                    await reaction.message.guild.members.cache.get(user.id).roles.add(team_data[team_no].role.id);
                    let join_embed = new Discord.MessageEmbed({
                        footer: {
                            text: `${user.username} has joined this team`,
                            icon_url: user.displayAvatarURL(),
                        },
                        color: colors.green,
                    });
                    await team_data[team_no].channel.send(join_embed);
                }
            });

            client.on('messageReactionRemove', async (reaction, user) => {
                if (reaction.message.partial) await reaction.message.fetch();
                if (reaction.partial) await reaction.fetch();
                if (user.bot) return;

                if (reaction.message.channel.id === annoucementChannel.id) {
                    const team_no = emojiArr.findIndex(e => e === reaction.emoji.name);
                    await reaction.message.guild.members.cache.get(user.id).roles.remove(team_data[team_no].role.id);
                    let leave_embed = new Discord.MessageEmbed({
                        footer: {
                            text: `${user.username} has left this team`,
                            icon_url: user.displayAvatarURL(),
                        },
                        color: colors.red,
                    });
                    await team_data[team_no].channel.send(leave_embed);
                }
            });


        }
    },
};
