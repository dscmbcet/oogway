const fs = require('fs');
const Discord = require('discord.js');
const { PREFIX, TEST_SERVER_ID } = require('../utils/constants');
const { logger } = require('../utils/logger');

/** @param {Discord.Client} client */
module.exports = (client) => {
    const eventFiles = fs.readdirSync('./events').filter((file) => file.endsWith('.js'));
    function productionRequests(parameter) {
        if (!parameter) {
            return false;
        }
        if (!parameter.guild) {
            return false;
        }
        return PREFIX === '~' && parameter.guild.id !== TEST_SERVER_ID;
    }

    eventFiles.forEach((file) => {
        const event = require(`../events/${file}`);
        client.on(event.name, async (...args) => {
            if (productionRequests(...args)) return;
            try {
                await event.execute(...args, client);
            } catch (e) {
                logger.error(`Event ${event.name} Error:`, e);
            }
        });
    });
};
