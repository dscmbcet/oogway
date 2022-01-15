const Discord = require('discord.js');
const { v4: uuidv4 } = require('uuid');
const { addToShowCaseList } = require('../firebase/showcase');
const { PREFIX, COLORS } = require('../utils/constants');
const { sendDissapearingMessage } = require('../utils/functions');

module.exports = {
    name: 'showcase',
    admin: true,
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
        const { channels: guildChannels } = message.guild;

        /** @type {Discord.Channel} */
        const category = guildChannels.cache.get(serverConfig.showcase_category_id);

        /** @type {Discord.Channel} */
        const showcaseAnnouncementChannel = guildChannels.cache.get(serverConfig.showcase_channel_id);

        const id = uuidv4().slice(0, 23);

        const textChannel = await guildChannels.create(TOPIC, {
            type: 'text',
            topic: DESCRIPTION,
            parent: category.id,
        });

        const voiceChannel = await guildChannels.create(`${TOPIC}-voice`, {
            type: 'voice',
            parent: category.id,
        });

        let embed = new Discord.MessageEmbed()
            .setTitle('Created Process Showcase Channels Succesfully')
            .addField('ID', id)
            .addField('Topic', TOPIC)
            .setFooter(`By ${message.author.tag}`, message.author.displayAvatarURL())
            .setColor(COLORS.green);

        await message.reply(embed);

        embed.setTitle('Process ShowCase');
        await textChannel.send(embed);

        embed = embed.setColor(COLORS.cyan).setDescription(`Join at <#${voiceChannel.id}> | <#${textChannel.id}>`);

        await addToShowCaseList(message, TOPIC, id, [textChannel.id, voiceChannel.id]);
        await showcaseAnnouncementChannel.send(embed);
    },
};
