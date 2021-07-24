require("dotenv").config();
const Discord = require("discord.js");

module.exports = {

    prefix: JSON.parse(process.env.CONFIG).prefix,
    team_emojis: ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟", "❤️", "🧡", "💛", "💚", "💙", "💜", "🤎", "🖤", "🤍"],
    REACTION_TYPE: {
        TEAM: 'TEAM',
        ANNOYMOUS: 'ANNOYMOUS'
    },
    /**
    * @param {Discord.Message} message
    * @param {string} roleID
    */
    findRoleById(message, roleID) { return message.guild.roles.cache.get(roleID) },

    /**
    * @param {Discord.Message} message
    * @param {string} roleName
    */
    findRoleByName(message, roleName) { return message.guild.roles.cache.find(role => role.name === roleName) },

    /**
    * @param {Discord.Message} message
    * @param {string} channelID
    */
    findChannelById(message, channelID) { return message.guild.channels.cache.get(channelID) },

    /**
    * @param {Discord.Message} message
    * @param {string} channelName
    */
    findChannelByName(message, channelName) { return message.guild.channels.cache.find(category => category.name === channelName) },

    /** @param {string[]} data String Data Array*/
    findBestMessageSize(data) {
        let BEST_LENGTH = 0;
        while (true) {
            const orginalSize = data.slice(0, data.length).join("\n").length;
            const size = data.slice(0, Math.min(data.length, BEST_LENGTH)).join("\n").length;
            if (orginalSize <= 3500) {
                BEST_LENGTH = orginalSize;
                break;
            }
            if (size >= 3500) {
                BEST_LENGTH -= 1;
                break;
            }
            BEST_LENGTH += 1;
        }
        return BEST_LENGTH;
    }

}