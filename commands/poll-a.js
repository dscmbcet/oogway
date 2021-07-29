const Discord = require('discord.js');
const { PREFIX, COLORS, REACTION_TYPE, TEAM_EMOJIS } = require('../utils/constants');
const { addReactionRole } = require('../firebase/firebase_handler');
const { sendDissapearingMessage } = require('../utils/functions');

module.exports = {
    name: 'poll-a',
    usage: `${PREFIX}poll-a <NUMBER> <TITLE> [DESCRIPTION]`,
    description: 'Creates a one time vote annonymous poll of given NUMBER with a TITLE and a DESCRIPTION',

    /**
     * @param {Discord.Message} message
     * @param {string[]} args
     */
    async execute(message, args) {
        if (args.length < 2) return sendDissapearingMessage(message, `Check your arguments, ${message.author}!`);

        const emojiArr = TEAM_EMOJIS.slice(0, 10);
        const pollNo = parseInt(args[0], 10);
        args.splice(0, 1);
        const description = args.join(' ');

        if (Number.isNaN(pollNo)) {
            return sendDissapearingMessage(`You didn't specify a number, ${message.author}!`);
        }
        if (pollNo === 0) {
            return sendDissapearingMessage(`Poll: Can't Be Zero, ${message.author}!`);
        }
        if (pollNo > emojiArr.length) {
            return sendDissapearingMessage(`POLL : Can't Be Greater Than ${emojiArr.length}, ${message.author}!`);
        }

        const embed = new Discord.MessageEmbed({
            title: 'Poll',
            description: `**${description}**\n\n_created by @${message.author.username}_`,
            color: COLORS.orange,
        });

        const embedMessage = await message.channel.send(embed);

        const data = [];
        if (!(pollNo === 0 || pollNo > emojiArr.length)) {
            for (let i = 0; i < pollNo; i++) {
                await embedMessage.react(emojiArr[i]);
                data.push({
                    emoji: emojiArr[i],
                    count: 0,
                    users: [],
                });
            }

            await addReactionRole(embedMessage, data, REACTION_TYPE.ANNOYMOUS);
        }
    },
};
