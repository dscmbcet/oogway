const Discord = require('discord.js');
const { colors, prefix, team_emojis } = require('../utils/constants');

module.exports = {
    name: 'poll',
    usage: `${prefix}poll <NUMBER> <TITLE> [DESCRIPTION]`,
    description: 'Creates a poll of given NUMBER with a TITLE and a DESCRIPTION',

    /**
     * @param {Discord.Message} message
     * @param {string[]} args
     */
    async execute(message, args) {
        if (args.length < 2) return message.channel.send(`Invalid Syntax, ${message.author}!`);
        else {
            let emojiArr = team_emojis.slice(0, 10),
                embed;

            const poll_no = args[0];

            args.splice(0, 1);
            const description = args.join(' ');

            if (poll_no == 0)
                embed = new Discord.MessageEmbed({
                    title: `POLL : Can't Be Zero`,
                    color: colors.red,
                });
            else if (poll_no > emojiArr.length)
                embed = new Discord.MessageEmbed({
                    title: `POLL : Can't Be Greater Than ${emojiArr.length}`,
                    color: colors.red,
                });
            else
                embed = new Discord.MessageEmbed({
                    title: `Poll`,
                    description: `**${description}**\n\n_Created by @${message.author.username}_`,
                    color: colors.orange,
                });

            const embedMessage = await message.channel.send(embed);

            if (!(poll_no === 0 || poll_no > emojiArr.length))
                for (let i = 0; i < poll_no; i++) await embedMessage.react(emojiArr[i]);
        }
    },
};
