const Discord = require('discord.js');
const { PREFIX, COLORS } = require('../utils/constants');
const { findRoleById } = require('../utils/functions');
const { getMember } = require('../firebase/firebase_handler');

module.exports = {
    name: 'dm-unverified',
    admin: true,
    usage: `${PREFIX}dm-unverified`,
    description: 'Alerts unverified users to verify themselves by sending DM and adds unverified role to users',

    /**
     * @param {Discord.Message} message
     * @param {string[]} args
     * @param {Discord.Client} client
     */
    async execute(message, args, client) {
        if (!message.member.permissions.has('MANAGE_GUILD')) return;

        const serverConfig = client.configs.get(message.guild.id);
        const unverifiedRole = findRoleById(message, serverConfig.unverified_role_id);

        message.guild.members.cache.forEach(async (e) => {
            const _user = message.guild.members.cache.get(e.id);
            const user = await getMember(_user);

            if (!user.verified) {
                const embed = new Discord.MessageEmbed()
                    .setTitle(`Please verify yourself at ${message.guild.name} Server`)
                    .setColor(COLORS.cyan)
                    .setThumbnail(message.guild.iconURL())
                    .setDescription(`Use command \`${PREFIX}verify-me\` in **oogway-spam** channel of server`)
                    .setFooter('Wish to see you there soon🙌');

                await _user.roles.add(unverifiedRole);
                try {
                    await _user.send(embed);
                } catch (error) {}
            } else {
                await _user.roles.remove(unverifiedRole);
            }
        });

        const embed = new Discord.MessageEmbed()
            .setTitle(":white_check_mark: Send DM's to unverifed-role")
            .setColor(COLORS.green)
            .setDescription("Assigned unverified roles to users and DM's are send");

        message.channel.send(embed);
    },
};