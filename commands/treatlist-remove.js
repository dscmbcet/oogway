const Discord = require('discord.js');
const { treatDataArray, addReactionRole } = require('../firebase');
const { PREFIX, COLORS, REACTION_TYPE } = require('../utils/constants');
const { sendDissapearingMessage } = require('../utils/functions');

module.exports = {
    name: 'treatlist-remove',
    usage: `${PREFIX}treatlist-remove <@user_name> <reason>`,
    description: 'Removes the user in treatlist with given reason',

    /**
     * @param {Discord.Message} message
     * @param {string[]} args
     */
    async execute(message, args) {
        if (args.length < 2) {
            return sendDissapearingMessage(message, `Check your arguments, ${message.author}!`);
        }
        if (!message.mentions.users.first()) {
            return sendDissapearingMessage(message, `You need to tag someone! ${message.author}`);
        }

        args.splice(0, 1);
        const description = args.join(' ').trim();
        const taggedUser = message.mentions.users.first();

        const treat = treatDataArray.find((e) => e.user_id === taggedUser.id && e.description === description);
        if (!treat) return sendDissapearingMessage(message, `No treat with given data found, ${message.author}!`);

        const tick = '✅';
        const minimumCount = 5;

        const member = message.guild.member(taggedUser);
        const embed = new Discord.MessageEmbed()
            .setTitle(`To remove ${member.user.tag} from treat list`)
            .setDescription(`Treat Reason: ${description}\n\nMininum ${minimumCount} members should react to ${tick}`)
            .setColor(COLORS.orange)
            .setThumbnail(taggedUser.displayAvatarURL());

        const reactMsg = await message.channel.send(embed);
        await reactMsg.react(tick);

        const parsedData = [
            {
                emoji: tick,
                count: 0,
                min_count: minimumCount,
                user_id: member.id,
                treat_id: treat.id,
                description,
                users: [],
            },
        ];
        await addReactionRole(reactMsg, parsedData, REACTION_TYPE.TREAT);
    },
};
