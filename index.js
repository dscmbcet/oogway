require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');
const { logger } = require('./utils/logger');
require('./firebase');
const { token } = JSON.parse(process.env.CONFIG);

const client = new Discord.Client();
client.login(token);

client.commands = new Discord.Collection();
client.events = new Discord.Collection();
client.configs = new Discord.Collection();

const handleFiles = fs.readdirSync('./handlers').filter((file) => file.endsWith('.js'));
handleFiles.forEach((file) => {
    require(`./handlers/${file}`)(client);
});

function exitHandler(options, exitCode) {
    logger.error('Process Exiting');
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) process.exit();
}

process
    .on('unhandledRejection', (err, p) => {
        logger.error(`Error: ${err.message} | ${err?.stack} Unhandled Rejection at Promise: ${p}`);
    })
    .on('uncaughtException', (err) => {
        logger.error(`UncaughtException: ${err.message} | ${err?.stack}`);
        process.exit(1);
    })
    .on('SIGINT', exitHandler.bind(null, { exit: true }))
    .on('SIGTERM', exitHandler.bind(null, { exit: true }));

module.exports = { client };
