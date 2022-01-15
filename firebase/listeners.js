const Discord = require('discord.js'); // eslint-disable-line no-unused-vars
const { listenForReactionRoles } = require('./reaction');
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
};

module.exports = initListeners;
