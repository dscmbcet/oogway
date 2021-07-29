const { PREFIX } = require('./constants');

const colors = {
    DEFAULT: '\x1b[0m',
    RED: '\x1b[31m\x1b[1m',
    RED_WHITEBG: '\x1b[41m\x1b[37m\x1b[1m',
    WHITE: '\x1b[1m',
    BLUE: '\x1b[34m\x1b[1m',
    YELLOW: '\x1b[33m\x1b[1m',
    PURPLE: '\x1b[35m\x1b[1m',
};

function sendlogs(args, isError) {
    if (PREFIX !== '!') return;
    const { client } = require('../app');
    const serverConifg = require('../configs/ooway-test');

    let msg;
    const INDIA_TZ_OFFSET = 1.98e7;
    const createdTime = new Date(new Date().valueOf() + INDIA_TZ_OFFSET).toUTCString().replace('GMT', 'IST');

    if (isError) msg = `${createdTime}| ERROR: ${args.join(' ')}`;
    else msg = `${createdTime}| INFO: ${args.join(' ')}`;
    msg = `\`\`\`${msg}\`\`\``;

    const channel = client.channels.cache.get(serverConifg.log_channel_id);
    channel.send(msg);
}

const logger = {
    log(...args) {
        console.log(`${colors.WHITE}LOG:${colors.DEFAULT}`, ...args);
    },
    debug(...args) {
        if (PREFIX !== '!') console.debug(`${colors.RED_WHITEBG} DEBUG ${colors.DEFAULT}`, ...args);
    },
    error(...args) {
        console.error(`${colors.RED}ERROR:${colors.DEFAULT}`, ...args);
        sendlogs(args, true);
    },
    warn(...args) {
        console.warn(`${colors.YELLOW}WARN:${colors.DEFAULT}`, ...args);
    },
    info(...args) {
        console.info(`${colors.BLUE}INFO:${colors.DEFAULT}`, ...args);
        sendlogs(args, false);
    },
    firebase(...args) {
        console.info(`${colors.PURPLE}FIREBASE:${colors.DEFAULT}`, ...args);
    },
};
module.exports = { logger };
