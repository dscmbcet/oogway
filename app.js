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

firebase.listenForTreat();

process
    .on('unhandledRejection', (reason, p) => {
        logger.error(reason, 'Unhandled Rejection at Promise', p);
    })
    .on('uncaughtException', (err) => {
        logger.error(err);
        process.exit(1);
    })
    .on('SIGINT', (reason, p) => {
        logger.error('Process Exiting');
    });

module.exports = { client };
