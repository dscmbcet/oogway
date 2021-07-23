const Discord = require("discord.js");

module.exports = {

    /**
    * @param {Discord.Message} message
    * @param {string} roleID Role ID
    */
    findRoleById(message, roleID) { return message.guild.roles.cache.find(role => role.id === roleID) },

    /**
    * @param {Discord.Message} message
    * @param {string} roleName Role ID
    */
    findRoleByName(message, roleName) { return message.guild.roles.cache.find(role => role.name === roleName) },

    /**
   * @param {Discord.Message} message
   * @param {string} channelID Channel ID
   */
    findChannelById(message, channelID) { return message.guild.channels.cache.find(category => category.id === channelID) },

    /**
    * @param {Discord.Message} message
    * @param {string} channeName Channel Name
    */
    findChannelByName(message, channeName) { return message.guild.channels.cache.find(category => category.name === channeName) },


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