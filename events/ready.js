// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js');
const { listenForReactionRoles, listenForTreat } = require('../firebase/firebase_handler');
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

        listenForReactionRoles();
        listenForTreat();
    },
};
