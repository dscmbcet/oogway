const { CronJob } = require('cron');
const { TIMEZONE } = require('../utils/constants');
const { showCaseDataArray, removeFromShowCaseList } = require('../firebase/showcase');
const { logger } = require('../utils/logger');

/**
 * Checks whether given timestamp is older than one day
 * @param {string} timestamp
 * @returns {boolean}
 */
const showcaseIsOld = (timestamp) => {
    const date1 = new Date();
    const date2 = new Date(timestamp);
    const diffDays = Math.ceil(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

    if (diffDays >= 1) return true;
    return false;
};

const runner = () => {
    logger.info('Running processShowCaseCron');
    showCaseDataArray.forEach((showcaseItem) => {
        if (showcaseIsOld(showcaseItem.timestamp)) removeFromShowCaseList(showcaseItem.id);
    });
};

const processShowCaseCron = new CronJob('0 */6 * * *', runner, null, false, TIMEZONE);

/**
 * Initializes process showcase cron
 */
const init = () => {
    processShowCaseCron.start();
};

module.exports = init;
