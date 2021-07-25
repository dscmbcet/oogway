require('dotenv').config();
const Discord = require('discord.js');
const fs = require('fs');
const firebase = require('./firebase/firebase_handler');
const { token } = JSON.parse(process.env.CONFIG);

const client = new Discord.Client();
client.login(token);

client.commands = new Discord.Collection();
client.events = new Discord.Collection();
client.configs = new Discord.Collection();

const handleFiles = fs.readdirSync('./handlers').filter(file => file.endsWith('.js'));
for (const file of handleFiles) require(`./handlers/${file}`)(client);

firebase.listenForReactionRoles();
firebase.listenForTreat();

process
    .on('unhandledRejection', (reason, p) => {
        console.error(reason, 'Unhandled Rejection at Promise', p);
    })
    .on('uncaughtException', err => {
        console.error(err);
        //process.exit(1);
    })
    .on('SIGINT', (reason, p) => {
        console.error('Process Exiting');
    });
