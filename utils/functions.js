const Discord = require('discord.js');
const { logger } = require('../utils/logger');
const { colors } = require('./constants');

module.exports = {
    /**
     * @param {Discord.Message} message
     * @param {string} roleID
     */
    findRoleById(message, roleID) {
        return message.guild.roles.cache.get(roleID);
    },

    /**
     * @param {Discord.Message} message
     * @param {string} roleName
     */
    findRoleByName(message, roleName) {
        return message.guild.roles.cache.find(role => role.name === roleName);
    },

    /**
     * @param {Discord.Message} message
     * @param {string} channelID
     */
    findChannelById(message, channelID) {
        return message.guild.channels.cache.get(channelID);
    },

    /**
     * @param {Discord.Message} message
     * @param {string} channelName
     */
    findChannelByName(message, channelName) {
        return message.guild.channels.cache.find(category => category.name === channelName);
    },

    /** @param {string[]} data String Data Array*/
    findBestMessageSize(data) {
        let BEST_LENGTH = 0;
        while (true) {
            const orginalSize = data.slice(0, data.length).join('\n').length;
            const size = data.slice(0, Math.min(data.length, BEST_LENGTH)).join('\n').length;
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
    },

    /**
     * @param {Discord.Message} message
     * @param {string} content
     * @param {string} [color] default = colors.red
     * @param {Number} [timeout] default = 30000
     */
    async sendDissapearingMessage(message, content, color, timeout) {
        let embed = new Discord.MessageEmbed({
            description: content,
            color: color ? color : colors.red,
        });
        const msg = await message.channel.send(embed);
        try {
            await msg.delete({ timeout: timeout ? timeout : 30000 });
        } catch (e) {
            logger.warn('Tried deleting a message that has already been deleted');
        }
    },
};
