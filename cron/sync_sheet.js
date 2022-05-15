const Discord = require('discord.js'); // eslint-disable-line no-unused-vars
const { CronJob } = require('cron');
const { TIMEZONE } = require('../utils/constants');
const { logger } = require('../utils/logger');
const updateDatabase = require('../commands/update-database');

/**
 * @param {Discord.Channel} channel
 */
const runner = (channel) => {
    logger.info('Running Sync Sheet');
    channel.send('Running Sync Sheet').then((message) => {
        message.delete();
        updateDatabase.execute(message);
    });
};

/**
 * Initializes Sync Sheet cron
 * @param {Discord.Channel} channel
 */
const init = (channel) => {
    const syncSheetCron = new CronJob(
        '0 0 */3 * *',
        () => {
            runner(channel);
        },
        null,
        false,
        TIMEZONE
    );
    syncSheetCron.start();
};

module.exports = init;
