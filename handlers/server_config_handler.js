const fs = require('fs');
const Discord = require('discord.js'); // eslint-disable-line no-unused-vars

/** @param {Discord.Client} client */
module.exports = (client) => {
    const configFiles = fs.readdirSync('./configs').filter((file) => file.endsWith('.js'));
    configFiles.forEach((file) => {
        const config = require(`../configs/${file}`);
        client.configs.set(config.id, config);
    });
};
