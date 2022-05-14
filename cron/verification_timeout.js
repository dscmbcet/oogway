const Discord = require('discord.js'); // eslint-disable-line no-unused-vars
const { CronJob } = require('cron');
const { TIMEZONE } = require('../utils/constants');
const { logger } = require('../utils/logger');
const { execute } = require('../commands/purge');

/**
 * Initializes Verification Timeout Cron
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
 * Initializes process showcase cron
 * @param {Discord.Client} client
 */
const init = (client) => {
    const serverConifg = require('../configs/dsc');
    const channel = client.channels.cache.get(serverConifg.log_channel_id);

    const verificationTimeoutCron = new CronJob(
        '*/1 * * * *',
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
