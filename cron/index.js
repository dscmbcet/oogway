/* eslint-disable no-unused-vars */
const Discord = require('discord.js'); // eslint-disable-line no-unused-vars
const processShowCaseCron = require('./process-showcase');
const verificationTimeoutCron = require('./verification_timeout');

/**
 * Initializes Cron jobs
 * @param {Discord.Client} client
 */
const initCronJobs = (client) => {
    processShowCaseCron();
    verificationTimeoutCron(client);
};

module.exports = initCronJobs;
