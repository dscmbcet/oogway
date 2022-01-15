const Discord = require('discord.js'); // eslint-disable-line no-unused-vars
const { listenForReactionRoles } = require('./reaction');
const { listenForShowCase } = require('./showcase');
const { listenForSpamLinkChanges } = require('./spam');
const { listenForTreat } = require('./treat');

/**
 * Initializes all listeners
 * @param {Discord.Client} client
 */
const initListeners = async (client) => {
    await listenForSpamLinkChanges();
    await listenForReactionRoles(client);
    await listenForTreat();
    await listenForShowCase(client);
};

module.exports = initListeners;
