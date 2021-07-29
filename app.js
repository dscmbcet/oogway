require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');
const { logger } = require('./utils/logger');
const firebase = require('./firebase/firebase_handler');
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

firebase.getLog();
firebase.listenForReactionRoles();
firebase.listenForTreat();

function exitHandler(options, exitCode) {
    firebase.writeLog().then(() => {
        logger.error('Process Exiting');
        if (exitCode || exitCode === 0) console.log(exitCode);
        if (options.exit) process.exit();
    });
}

process
    .on('unhandledRejection', (reason, p) => {
        logger.error(reason, 'Unhandled Rejection at Promise', p);
    })
    .on('uncaughtException', (err) => {
        logger.error(err);
        process.exit(1);
    })
    .on('SIGINT', exitHandler.bind(null, { exit: true }))
    .on('SIGTERM', exitHandler.bind(null, { exit: true }))
    .on('SIGUSR1', exitHandler.bind(null, { exit: true }))
    .on('SIGUSR2', exitHandler.bind(null, { exit: true }));

module.exports = { client };
