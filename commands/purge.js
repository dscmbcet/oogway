const Discord = require('discord.js');
const { PREFIX, COLORS } = require('../utils/constants');
const { sendDissapearingMessage } = require('../utils/functions');
const { logger } = require('../utils/logger');

module.exports = {
    name: 'purge',
    admin: true,
    usage: `${PREFIX}purge`,
    description: 'Kicks all unverified members from server and sends DM',

    /**
     * @param {Discord.Message} message
     * @param {string[]} args
     * @param {Discord.Client} client
     */
    async execute(message, args, client) {
        const member = message.guild.member(message.author.id);
        if (!message.member.hasPermission('ADMINISTRATOR')) {
            return sendDissapearingMessage(message, `You are not wise enough to make that call my friend ${member}`);
        }

        const serverConfig = client.configs.get(message.guild.id);
        const unverifiedRole = message.guild.roles.cache.get(serverConfig.unverified_role_id);
        const coreTeamRole = message.guild.roles.cache.get(serverConfig.core_team_role_id);

        const date = new Date();
        const threeDayOld = new Date(date.setDate(date.getDate() - 3));

        unverifiedRole.members.forEach((user) => {
            if (coreTeamRole.members.get(user.id)) return;
            if (user.joinedAt < threeDayOld) {
                try {
                    user.send(
                        [
                            `Dear ${user},`,
                            `We have noticed you haven't verified yourself in our ${message.guild.name} server.`,
                            'To protect our community, we had to **kick** you out temporarily.',
                            '\nYou can join back using the invite link - https://discord.gg/HsrbnCkXbc',
                            'Do ensure to verify yourself back.',
                        ].join('\n')
                    );
                } catch (error) {}

                user.kick('Verification Timeout');
            }
        });

        logger.info(`Purge command has been used by ${message.author.tag}`);

        const embed = new Discord.MessageEmbed()
            .setTitle(':white_check_mark: unverifed Members Purged')
            .setColor(COLORS.green)
            .setDescription("Kicked `unverified roles` and DM's are send");

        return message.channel.send(embed);
    },
};
