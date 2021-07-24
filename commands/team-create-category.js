const Discord = require("discord.js");
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
            let emojiArr = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟", "❤️", "🧡", "💛", "💚", "💙", "💜", "🤎", "🖤", "🤍"];
            let team_data = [], embed;

            if (!message.member.hasPermission('ADMINISTRATOR')) {
                embed = new Discord.MessageEmbed({
                    description: `You are not wise enough to make those channels my friend** ${message.member}**`,
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
            const CATEGORY_NAME = args.join(" ").trim().toLocaleUpperCase();

            const server_config = client.configs.get(message.guild.id);
            const new_member_default_role_name = server_config.new_member_default_role_name;
            const core_team_role_name = server_config.core_team_role_name;
            const core_team_role = findRoleByName(message, core_team_role_name);

            const general_permissions = [
                {
                    id: core_team_role.id,
                    allow: core_team_role.permissions
                },
                {
                    id: message.guild.roles.everyone,
                    deny: ['VIEW_CHANNEL', 'SEND_MESSAGES', 'CONNECT']
                }
            ]

            const role = message.guild.roles;
            const channel = message.guild.channels;

            const categoryRole = await role.create({ data: { name: CATEGORY_NAME, color: 'BLACK' } });
            const memberRolePermissions = findRoleByName(message, new_member_default_role_name).permissions;

            const category = await channel.create(CATEGORY_NAME, {
                type: 'category',
                permissionOverwrites: [
                    {
                        id: categoryRole.id,
                        allow: memberRolePermissions
                    },
                    ...general_permissions
                ]
            });

            /** @type {Discord.Channel} */
            const annoucementChannel = await channel.create(`announcements`, {
                type: 'text',
                parent: category.id,
                permissionOverwrites: [
                    {
                        id: categoryRole.id,
                        allow: ['VIEW_CHANNEL', 'READ_MESSAGE_HISTORY', 'ADD_REACTIONS'],
                        deny: ['SEND_MESSAGES']
                    },
                    ...general_permissions
                ]
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
                        allow: memberRolePermissions
                    },
                    ...general_permissions
                ]

                const team_channel = await channel.create(`team ${i}`, {
                    type: 'text',
                    parent: category.id,
                    permissionOverwrites: team_permission,
                });

                await channel.create(`team ${i}`, {
                    type: 'voice',
                    parent: category.id,
                    permissionOverwrites: team_permission
                });

                team_data.push({ channel: team_channel, role: team_role });
            }

            embed = new Discord.MessageEmbed({
                title: "Created Category Succesfully",
                color: colors.green,
            });

            await message.reply(embed);

            let desc = [];
            for (let i = 0; i < TEAM_NO; i++) desc.push(`${team_data[i].role} :  ${emojiArr[i]}\n`);

            let reaction_embed = new Discord.MessageEmbed({
                title: "React the following emojis to get roles",
                description: desc.join('\n'),
                color: colors.orange,
            });

            let reaction_msg = await annoucementChannel.send(reaction_embed);
            for (let i = 0; i < TEAM_NO; i++) await reaction_msg.react(emojiArr[i]);

            client.on('messageReactionAdd', async (...args) =>
                await this.handleReaction(...args, true, emojiArr, reaction_msg, team_data));

            client.on('messageReactionRemove', async (...args) =>
                await this.handleReaction(...args, false, emojiArr, reaction_msg, team_data));
        }
    },


    /**
     * @param {Discord.MessageReaction} reaction
     * @param {Discord.User | Discord.PartialUser} user
     * @param {boolean} roleAddEvent
     * @param {string[]} emojiArr
     * @param {Discord.Message} reaction_message
     * @param {any[]} team_data
     */
    async handleReaction(reaction, user, roleAddEvent, emojiArr, reaction_message, team_data) {
        if (reaction.message.partial) await reaction.message.fetch();
        if (reaction.partial) await reaction.fetch();
        if (user.bot) return;

        if (reaction.message.id === reaction_message.id) {
            const team_no = emojiArr.findIndex(e => e === reaction.emoji.name);
            try {
                const user_roles = await reaction.message.guild.members.cache.get(user.id).roles;
                if (roleAddEvent) user_roles.add(team_data[team_no].role.id);
                else user_roles.remove(team_data[team_no].role.id);
            }
            catch (e) {
                console.error(`Command: ${this.name}, User:  ${user.username} Error: ${e.name}: ${e.message}`);
                embed = new Discord.MessageEmbed({
                    description: roleAddEvent ?
                        `Some error occured assigning your ${team_data[team_no].role} role my friend** ${user}**` :
                        `Some error occured removing your ${team_data[team_no].role} role my friend** ${user}**`,
                    color: colors.red,
                })
                return reaction_message.channel.send(embed)
            }
            let embed = new Discord.MessageEmbed({
                footer: {
                    text: roleAddEvent ?
                        `${user.username} has joined this team` :
                        `${user.username} has left this team`,
                    icon_url: user.displayAvatarURL(),
                },
                color: roleAddEvent ? colors.green : colors.red,
            });
            await team_data[team_no].channel.send(embed);
        }
    }
};
