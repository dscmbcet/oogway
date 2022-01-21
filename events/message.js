const Discord = require('discord.js');
const { firebaseSpamLinkArray } = require('../firebase/spam');
const { COLORS, PREFIX } = require('../utils/constants');
const { logger } = require('../utils/logger');

module.exports = {
    name: 'message',

    /**
     * @param {Discord.Message} message
     * @param {Discord.Client} client
     * */
    async execute(message, client) {
        if (message.author.bot) return;
        if (message.channel.type === 'dm') {
            const { messageHandler } = require('./guildMemberAdd');
            messageHandler(message, client);
            return;
        }

        if (!message.content.startsWith(PREFIX)) await this.checkSpamMessage(message, client);
        if (!message.content.startsWith(PREFIX)) return;

        let embed;

        const args = message.content.slice(PREFIX.length).trim().split(' ');
        const command = args.shift().toLowerCase();

        const commandFileData = client.commands.get(command);
        if (!commandFileData) return;

        if (command.disable) {
            embed = new Discord.MessageEmbed({
                title: 'Disabled',
                description: 'This command is temporarily disabled',
                color: COLORS.red,
            });
            return message.channel.send(embed).then((msg) => {
                msg.delete({ timeout: 5000 });
            });
        }

        logger.log(`Recieved command from: ${message.author.tag} , command: ${message.content} `);
        try {
            await commandFileData.execute(message, args, client);
        } catch (e) {
            logger.error(`Command: ${command} Error: ${e.message} | ${e?.stack}`);
            embed = new Discord.MessageEmbed({
                title: 'Error Occured',
                description: 'I am not feeling too well my friend',
                color: COLORS.red,
            });
            return message.channel.send(embed).then((msg) => {
                msg.delete({ timeout: 5000 });
            });
        }
    },

    /**
     * Checks if given message is a nitro spam message
     * @param {Discord.Message} message
     * @param {Discord.Client} client
     * */
    async checkSpamMessage(message, client) {
        const msg = message.content;

        const spamArray = firebaseSpamLinkArray.map((e) => e.link);

        let flag = false;
        if (msg.toLowerCase().includes('@everyone') && msg.toLowerCase().includes('nitro')) {
            flag = true;
        } else {
            for (let index = 0; index < spamArray.length; index++) {
                if (msg.toLowerCase().includes(spamArray[index])) {
                    flag = true;
                    break;
                }
            }
        }

        if (flag) {
            const member = message.guild.member(message.author.id);
            try {
                await member.send(
                    [
                        `Dear ${member},`,
                        'We have noticed you are not following our guidelines properly',
                        'As mentioned earlier we will not tolerate any kind of misbehaviour,',
                        'You are being `KICKED` from **GsDSC MBCET Server**',
                    ].join('\n')
                );
            } catch (error) {}
            try {
                member.kick('Used spam link');
            } catch (error) {}

            const embed = new Discord.MessageEmbed()
                .setTitle(`${member.user.tag} used spam link`)
                .setDescription(`Message :-\n\`\`\`${message.content}\`\`\``)
                .setThumbnail(member.user.displayAvatarURL())
                .setColor(COLORS.cyan);

            message.delete();

            const serverConfig = client.configs.get(message.guild.id);
            const channel = client.channels.cache.get(serverConfig.moderator_channel_id);
            channel.send(embed);
        }
    },
};
