const fs = require('fs');
const Discord = require('discord.js');
const { logger } = require('../utils/logger');

/** @param {Discord.Client} client */
module.exports = client => {
    const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`../commands/${file}`);
        client.commands.set(command.name, command);
    }
};
