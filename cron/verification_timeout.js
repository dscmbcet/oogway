const Discord = require('discord.js'); // eslint-disable-line no-unused-vars
const { CronJob } = require('cron');
const { TIMEZONE } = require('../utils/constants');
const { logger } = require('../utils/logger');
const { execute } = require('../commands/purge');

/**
 * @param {Discord.Channel} channel
 * @param {Discord.Client} client
 */
const runner = (channel, client) => {
    logger.info('Running Verification Timeout');
    channel.send('Running Verification Timeout').then((message) => {
        message.delete();
        execute(message, [], client);
    });
};

/**
 * Initializes Verification Timeout cron
 * @param {Discord.Channel} channel
 * @param {Discord.Client} client
 */
const init = (channel, client) => {
    const verificationTimeoutCron = new CronJob(
        '0 0 */3 * *',
        () => {
            runner(channel, client);
        },
        null,
        false,
        TIMEZONE
    );
    verificationTimeoutCron.start();
};

module.exports = init;
