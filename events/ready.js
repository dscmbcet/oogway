const Discord = require('discord.js'); // eslint-disable-line no-unused-vars
const initListeners = require('../firebase/listeners');
const { PREFIX } = require('../utils/constants');
const { logger } = require('../utils/logger');

module.exports = {
    name: 'ready',

    /** @param {Discord.Client} client */
    execute(client) {
        const guilds = client.guilds.cache.map((guild) => guild.name);
        if (PREFIX === '!') logger.debug('PRODUCTION_MODE');
        else logger.debug('DEVELOPMENT_MODE');
        logger.info('Master Oogway Is Ready!');
        logger.info(`PREFIX: ${PREFIX}`);
        logger.info('Handling Guilds:', guilds.join(', '));

        initListeners(client);
    },
};
