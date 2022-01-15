const fs = require('fs');
const { PREFIX, TESTER_ID } = require('./constants');

const colors = {
    DEFAULT: '\x1b[0m',
    RED: '\x1b[31m\x1b[1m',
    RED_WHITEBG: '\x1b[41m\x1b[37m\x1b[1m',
    WHITE: '\x1b[1m',
    BLUE: '\x1b[34m\x1b[1m',
    YELLOW: '\x1b[33m\x1b[1m',
    PURPLE: '\x1b[35m\x1b[1m',
};

function getDate() {
    const INDIA_TZ_OFFSET = 1.98e7;
    return new Date(new Date().valueOf() + INDIA_TZ_OFFSET).toUTCString().replace('GMT', 'IST');
}

function sendlogs(args, isError) {
    if (PREFIX !== '!') return;
    const { client } = require('..');
    const serverConifg = require('../configs/dsc');

    let msg;
    const createdTime = getDate();
    if (isError) msg = `${createdTime}| ERROR: ${args.join(' ')}`;
    else msg = `${createdTime}| INFO: ${args.join(' ')}`;

    msg = `\`\`\`${msg}\`\`\``;
    if (isError) msg = `<@${TESTER_ID}>\n${msg}`;

    const channel = client.channels.cache.get(serverConifg.log_channel_id);
    channel.send(msg);
}

const log = fs.createWriteStream('info.log', { flags: 'a' });

const logger = {
    log(...args) {
        console.log(`[${getDate()}] ${colors.WHITE}[LOG]${colors.DEFAULT}`, ...args);
        log.write(`[${getDate()}] ${colors.WHITE}[LOG]${colors.DEFAULT} ${args.join(' ')}\n`);
    },
    debug(...args) {
        if (PREFIX !== '!') console.debug(`[${getDate()}] ${colors.RED_WHITEBG} DEBUG ${colors.DEFAULT}`, ...args);
    },
    error(...args) {
        console.error(`[${getDate()}] ${colors.RED}[ERROR]${colors.DEFAULT}`, ...args);
        log.write(`[${getDate()}] ${colors.RED}[ERROR]${colors.DEFAULT} ${args.join(' ')}\n`);
        sendlogs(args, true);
    },
    warn(...args) {
        console.warn(`[${getDate()}] ${colors.YELLOW}[WARN]${colors.DEFAULT}`, ...args);
        log.write(`[${getDate()}] ${colors.YELLOW}[WARN]${colors.DEFAULT} ${args.join(' ')}\n`);
    },
    info(...args) {
        console.info(`[${getDate()}] ${colors.BLUE}[INFO]${colors.DEFAULT}`, ...args);
        log.write(`[${getDate()}] ${colors.BLUE}[INFO]${colors.DEFAULT} ${args.join(' ')}\n`);
        sendlogs(args, false);
    },
    firebase(...args) {
        console.info(`[${getDate()}] ${colors.PURPLE}[FIREBASE]${colors.DEFAULT}`, ...args);
        log.write(`[${getDate()}] ${colors.PURPLE}[FIREBASE]${colors.DEFAULT} ${args.join(' ')}\n`);
    },
};

module.exports = { logger };
