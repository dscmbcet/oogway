const Discord = require("discord.js");
const { treatDataArray } = require("../firebase/firebase_handler");
const colors = require("../utils/colors");
const { prefix } = require("../utils/functions");

module.exports = {
    name: "treatlist",
    usage: `${prefix}treatlist`,
    description: "Gives the current treatlist",

    /**
     * @param {Discord.Message} message
     * @param {string[]} args
     */
    async execute(message, args) {
        let toSend = treatDataArray.map(e => {
            const user = message.guild.members.cache.find(person => person.id == e.user_id).user;
            const description = e.description;
            return `${user} : ${description}`
        }).join('\n');

        if (!toSend) toSend = 'No one yet'
        const embed = new Discord.MessageEmbed()
            .setTitle('Treat List')
            .setColor(colors.orange)
            .setDescription(toSend)
        return message.channel.send(embed);
    },
};
