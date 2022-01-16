const Discord = require('discord.js');
const { removeFromShowCaseList, showCaseDataArray } = require('../firebase/showcase');
const { PREFIX, COLORS } = require('../utils/constants');
const { sendDissapearingMessage } = require('../utils/functions');

module.exports = {
    name: 'showcase-remove',
    usage: `${PREFIX}showcase-remove <ID>`,
    description: 'Removes the text and voice channels of showcase of given ID',

    /**
     * @param {Discord.Message} message
     * @param {string[]} args
     */
    async execute(message, args) {
        if (args.length < 1) return sendDissapearingMessage(message, `Check your arguments, ${message.author}!`);

        const id = args[0].trim().toLowerCase();

        const showCaseData = showCaseDataArray.find((e) => e.id === id);
        if (!showCaseData) return sendDissapearingMessage(message, `No process showcase with given \`${id}\` ID found, ${message.author}!`);

        await removeFromShowCaseList(id);
        const embed = new Discord.MessageEmbed()
            .setTitle('Deleted Process Showcase Channels')
            .addField('Topic', showCaseData.topic)
            .addField('Description', showCaseData.description)
            .setColor(COLORS.green);

        await message.reply(embed);
    },
};
