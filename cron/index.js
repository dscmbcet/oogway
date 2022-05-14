/* eslint-disable no-unused-vars */
const Discord = require('discord.js'); // eslint-disable-line no-unused-vars
const processShowCaseCron = require('./process-showcase');
const verificationTimeoutCron = require('./verification_timeout');
const syncSheetCron = require('./sync_sheet');

/**
 * Initializes Cron jobs
 * @param {Discord.Client} client
 */
const initCronJobs = (client) => {
    const serverConifg = require('../configs/dsc');
    const logChannel = client.channels.cache.get(serverConifg.log_channel_id);

    processShowCaseCron();
    verificationTimeoutCron(logChannel, client);
    syncSheetCron(logChannel);
};

module.exports = initCronJobs;
