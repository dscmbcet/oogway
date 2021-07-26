const Discord = require('discord.js');
const { colors } = require('../utils/constants');
const { logger } = require('../utils/logger');

module.exports = {
    name: 'guildMemberAdd',

    /**
     * @param {Discord.GuildMember} member
     * @param {Discord.Client} client
     * */
    async execute(member, client) {
        const guild = member.guild;
        const server_config = client.configs.get(guild.id);
        const channel = guild.channels.cache.get(server_config.welcome_channel_id);
        const new_member_role = guild.roles.cache.get(server_config.new_member_default_role_id);

        try {
            await member.roles.add(new_member_role.id);
        } catch (e) {
            logger.log(e);
            logger.error(`Event: ${this.name} Error: ${e.name}: ${e.message}`);
        }

        logger.log(`${guild.name}:A new member just arrived: ${member.user.tag}`);

        if (!channel) return;
        let embed = new Discord.MessageEmbed({
            title: `A new member just arrived!`,
            description: [
                `Welcome **${member.user.tag}** we hope you enjoy your stay here!`,
                `\nI am **Master Oogway**, bot of GDSC MBCET`,
                `To get to know me type: \`!help-v\``,
            ].join('\n'),
            thumbnail: { url: member.user.displayAvatarURL() },
            color: colors.cyan,
        });

        await channel.send(embed);

        embed = new Discord.MessageEmbed({
            title: `GDSC MBCET`,
            color: colors.orange,
            thumbnail: { url: member.guild.iconURL() },
            description: [
                `Welcome **${member.user.tag}** we hope you enjoy your stay here!`,
                `\nI am **Master Oogway**, bot of GDSC MBCET`,
                `To get to know me type: \`!help-v\` in GDSC Discord Channel`,
            ].join('\n'),
        });

        return member.send(embed); //Direct Message
    },
};
