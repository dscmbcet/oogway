const Discord = require('discord.js');
const { PREFIX, COLORS } = require('../utils/constants');
const { sendDissapearingMessage } = require('../utils/functions');

module.exports = {
    name: 'showcase',
    usage: `${PREFIX}showcase <TOPIC> - <DESCRIPTION>`,
    description: 'Creates a text and voice channels of TOPIC for showcasing workflow',

    /**
     * @param {Discord.Message} message
     * @param {string[]} args
     * @param {Discord.Client} client
     */
    async execute(message, args, client) {
        if (!message.member.hasPermission('MANAGE_CHANNELS')) {
            return sendDissapearingMessage(message, `You are not wise enough to make those channels my friend ${message.author}`);
        }

        let TOPIC;
        let DESCRIPTION;

        try {
            args = args.join(' ');
            TOPIC = args.split(' - ')[0].trim().toLowerCase();
            DESCRIPTION = args.split(' - ')[1].trim();
        } catch (error) {
            return sendDissapearingMessage(message, `Check your arguments, ${message.author}!`);
        }

        const serverConfig = client.configs.get(message.guild.id);

        const channel = message.guild.channels;

        /** @type {Discord.Channel} */
        const category = channel.cache.get(serverConfig.showcase_category_id);

        /** @type {Discord.Channel} */
        const showcaseAnnouncementChannel = channel.cache.get(serverConfig.showcase_channel_id);

        const textChannel = await channel.create(TOPIC, {
            type: 'text',
            topic: DESCRIPTION,
            parent: category.id,
        });

        const voiceChannel = await channel.create(`${TOPIC}-voice`, {
            type: 'voice',
            parent: category.id,
        });

        let embed = new Discord.MessageEmbed({
            title: `Created Process Showcase Channels For ${TOPIC} Succesfully`,
            color: COLORS.green,
        });

        await message.reply(embed);

        embed = new Discord.MessageEmbed()
            .setColor(COLORS.cyan)
            .setTitle('Process Showcase')
            .setFooter(`By ${message.author.tag}`, message.author.displayAvatarURL())
            .setDescription(`Topic : **${TOPIC}**\n${DESCRIPTION}\n\nJoin at <#${voiceChannel.id}> | <#${textChannel.id}>`);

        await showcaseAnnouncementChannel.send(embed);
    },
};
