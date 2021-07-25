const Discord = require('discord.js');
const { prefix, team_emojis, REACTION_TYPE } = require('../utils/functions');
const colors = require('../utils/colors');
const { addReactionRole } = require('../firebase/firebase_handler');

module.exports = {
    name: 'poll-a',
    usage: `${prefix}poll-a <NUMBER> <TITLE> [DESCRIPTION]`,
    description: 'Creates a one time vote annonymous poll of given NUMBER with a TITLE and a DESCRIPTION',

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

            let data = [];
            if (!(poll_no === 0 || poll_no > emojiArr.length)) {
                for (let i = 0; i < poll_no; i++) {
                    await embedMessage.react(emojiArr[i]);
                    data.push({
                        emoji: emojiArr[i],
                        count: 0,
                        users: [],
                    });
                }

                await addReactionRole(embedMessage, data, REACTION_TYPE.ANNOYMOUS);
            }
        }
    },
};
