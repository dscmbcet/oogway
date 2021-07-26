const { prefix } = require('./constants');

const colors = {
    DEFAULT: '\x1b[0m',
    RED: `\x1b[31m\x1b[1m`,
    RED_WHITEBG: '\x1b[41m\x1b[37m\x1b[1m',
    WHITE: '\x1b[1m',
    BLUE: '\x1b[34m\x1b[1m',
    YELLOW: '\x1b[33m\x1b[1m',
    PURPLE: '\x1b[35m\x1b[1m',
};

const logger = {
    log: function (...args) {
        console.log(`${colors.WHITE}LOG:${colors.DEFAULT}`, ...args);
    },
    debug: function (...args) {
        if (prefix !== '!') console.debug(`${colors.RED_WHITEBG} DEBUG ${colors.DEFAULT}`, ...args);
    },
    error: function (...args) {
        console.error(`${colors.RED}ERROR:${colors.DEFAULT}`, ...args);
    },
    warn: function (...args) {
        console.warn(`${colors.YELLOW}WARN:${colors.DEFAULT}`, ...args);
    },
    info: function (...args) {
        console.info(`${colors.BLUE}INFO:${colors.DEFAULT}`, ...args);
    },
    firebase: function (...args) {
        console.info(`${colors.PURPLE}FIREBASE:${colors.DEFAULT}`, ...args);
    },
};

module.exports = { logger };
