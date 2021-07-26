const Discord = require('discord.js');
const { colors, prefix, team_emojis } = require('../utils/constants');
const { logger } = require('../utils/logger');

module.exports = {
    name: 'poll',
    usage: `${prefix}poll <NUMBER> <TITLE> [DESCRIPTION]`,
    description: 'Creates a poll of given NUMBER with a TITLE and a DESCRIPTION',

    /**
     * @param {Discord.Message} message
     * @param {string[]} args
     */
    async execute(message, args) {
        if (args.length < 2) return sendDissapearingMessage(message, `Check your arguments, ${message.author}!`);
        else {
            let emojiArr = team_emojis.slice(0, 10),
                embed;
            const poll_no = parseInt(args[0]);
            if (isNaN(poll_no)) return sendDissapearingMessage(`You didn't specify a number, ${message.author}!`);
            if (poll_no == 0) return sendDissapearingMessage(`Poll: Can't Be Zero, ${message.author}!`);
            else if (poll_no > emojiArr.length)
                return sendDissapearingMessage(`POLL : Can't Be Greater Than ${emojiArr.length}, ${message.author}!`);
            else {
                embed = new Discord.MessageEmbed({
                    title: `Poll`,
                    description: `**${description}**\n\n_Created by @${message.author.username}_`,
                    color: colors.orange,
                });

                const embedMessage = await message.channel.send(embed);

                if (!(poll_no === 0 || poll_no > emojiArr.length))
                    for (let i = 0; i < poll_no; i++) await embedMessage.react(emojiArr[i]);
            }
        }
    },
};
