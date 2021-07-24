const Discord = require("discord.js");
const { prefix } = require("../utils/functions");
const { welcome_channel_name, new_member_default_role_name, test_server_id } = require("../config");
const colors = require("../utils/colors");

module.exports = {
    name: 'guildMemberAdd',

    /** @param {Discord.GuildMember} member*/
    async execute(member) {
        const guild = member.guild;
        const channel = guild.channels.cache.find((ch) => ch.name === welcome_channel_name);
        const new_member_role = guild.roles.cache.find(role => role.name === new_member_default_role_name);

        try { await member.roles.add(new_member_role.id) }
        catch (e) { console.error(`Event: ${this.name} Error: ${e.name}: ${e.message}`) }

        console.log(`${guild.name}:A new member just arrived: ${member.user.tag}`)

        if (!channel) return;
        let embed = new Discord.MessageEmbed({
            title: `A new member just arrived!`,
            description: [
                `Welcome ${member} we hope you enjoy your stay here!`,
                `I am **Master Oogway**, bot of GDSC MBCET`,
                `\nTo get to know me type: \`!help-v\``
            ].join('\n'),
            thumbnail: { url: member.user.displayAvatarURL() },
            color: colors.cyan
        });

        await channel.send(embed);

        embed = new Discord.MessageEmbed({
            title: `GDSC MBCET`,
            color: colors.orange,
            thumbnail: { url: member.guild.iconURL() },
            description: [
                `Welcome ${member} we hope you enjoy your stay here!`,
                `I am **Master Oogway**, bot of GDSC MBCET`,
                `\nTo get to know me type: \`!help-v\` in GDSC Discord Channel`
            ].join('\n'),
        })

        return member.send(embed); //Direct Message
    },
}