const Discord = require('discord.js');
const { treatDataArray, addReactionRole } = require('../firebase/firebase_handler');
const { prefix, colors, REACTION_TYPE } = require('../utils/constants');
const { sendDissapearingMessage } = require('../utils/functions');
const { logger } = require('../utils/logger');

module.exports = {
    name: 'treatlist-remove',
    usage: `${prefix}treatlist-remove <@user_name> <reason>`,
    description: 'Removes the user in treatlist with given reason',

    /**
     * @param {Discord.Message} message
     * @param {string[]} args
     */
    async execute(message, args) {
        if (args.length < 2) return sendDissapearingMessage(message, `Check your arguments, ${message.author}!`);
        else if (!message.mentions.users.first()) return sendDissapearingMessage(message, `You need to tag someone! ${member}`);
        else {
            const tag_user = message.mentions.users.first();
            args.splice(0, 1);
            const description = args.join(' ').trim();
            const treat = treatDataArray.find(e => e.user_id === tag_user.id && e.description == description);
            if (!treat) return sendDissapearingMessage(message, `No treat with given data found, ${message.author}!`);
            const tick = '✅';
            const minimum_count = 5;

            const member = message.guild.member(tag_user);
            const embed = new Discord.MessageEmbed()
                .setTitle(`To remove ${member.user.tag} from treat list`)
                .setDescription(`Mininum ${minimum_count} members should react to ${tick}`)
                .setColor(colors.orange)
                .setFooter(description, tag_user.displayAvatarURL());

            const reactMsg = await message.channel.send(embed);
            await reactMsg.react(tick);

            const data = [
                {
                    emoji: tick,
                    count: 0,
                    min_count: minimum_count,
                    user_id: member.id,
                    treat_id: treat.id,
                    description: description,
                    users: [],
                },
            ];
            await addReactionRole(reactMsg, data, REACTION_TYPE.TREAT);
        }
    },
};
