const fs = require('fs');
// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js');

/** @param {Discord.Client} client */
module.exports = (client) => {
    const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));
    commandFiles.forEach((file) => {
        const command = require(`../commands/${file}`);
        client.commands.set(command.name, command);
    });
};
