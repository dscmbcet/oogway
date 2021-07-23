const Discord = require("discord.js");
const colors = require("../utils/colors");
const { prefix, findRoleByName } = require("../utils/functions");

module.exports = {
    name: "reaction-roles",
    usage: `${prefix}reaction-role <@role_1> [..@role_N]`,
    description: "Creates reaction role with given no. of role tags",

    /**
     * @param {Discord.Message} message
     * @param {string[]} args
     * @param {Discord.Client} client
     */
    async execute(message, args, client) {
        if (message.mentions.roles.size === 0)
            return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
        else {
            let emojiArr = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟", "❤️", "🧡", "💛", "💚", "💙", "💜", "🤎", "🖤", "🤍"], embed;
            let team_data = message.mentions.roles.array().sort();

            if (!message.member.hasPermission('ADMINISTRATOR')) {
                embed = new Discord.MessageEmbed({
                    description: `You are not wise enough to give roles to others** ${member}**`,
                    color: colors.red,
                })
                return message.channel.send(embed);
            }

            const TEAM_NO = message.mentions.roles.size;
            if (TEAM_NO > emojiArr.length) {
                embed = new Discord.MessageEmbed({
                    title: `Roles Can't Be Greater Than ${emojiArr.length}`,
                    color: colors.red,
                });
                return message.channel.send(embed);
            }

            let desc = [];
            for (let i = 0; i < TEAM_NO; i++) desc.push(`${team_data[i].name} :  ${emojiArr[i]}\n`);

            let reaction_embed = new Discord.MessageEmbed({
                title: "React the following emojis to get roles",
                description: desc.join('\n'),
                color: colors.orange,
            });

            let reaction_msg = await message.channel.send(reaction_embed);
            for (let i = 0; i < TEAM_NO; i++) await reaction_msg.react(emojiArr[i]);

            client.on('messageReactionAdd', async (reaction, user) => {
                if (reaction.message.partial) await reaction.message.fetch();
                if (reaction.partial) await reaction.fetch();
                if (user.bot) return;

                if (reaction.message.id === reaction_msg.id) {
                    const team_no = emojiArr.findIndex(e => e === reaction.emoji.name);
                    try { await reaction.message.guild.members.cache.get(user.id).roles.add(team_data[team_no].id) }
                    catch (e) {
                        console.error(`Command: ${this.name}, User:  ${user.username} Error: ${e.name}: ${e.message}`);
                        embed = new Discord.MessageEmbed({
                            description: `Some error occured assigning you ${team_data[team_no]} role my friend** ${user}**`,
                            color: colors.red,
                        })
                        message.channel.send(embed)
                    }
                }
            });

            client.on('messageReactionRemove', async (reaction, user) => {
                if (reaction.message.partial) await reaction.message.fetch();
                if (reaction.partial) await reaction.fetch();
                if (user.bot) return;

                if (reaction.message.id === reaction_msg.id) {
                    const team_no = emojiArr.findIndex(e => e === reaction.emoji.name);
                    try { await reaction.message.guild.members.cache.get(user.id).roles.remove(team_data[team_no].id) }
                    catch (e) {
                        console.error(`Command: ${this.name}, User:  ${user.username} Error: ${e.name}: ${e.message}`);
                        embed = new Discord.MessageEmbed({
                            description: `Some error occured removing your ${team_data[team_no]} role my friend** ${user}**`,
                            color: colors.red,
                        })
                        message.channel.send(embed)
                    }
                }
            });
        }
    },
};
