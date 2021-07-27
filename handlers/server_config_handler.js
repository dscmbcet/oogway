const fs = require('fs');
// eslint-disable-next-line no-unused-vars
const Discord = require('discord.js');

/** @param {Discord.Client} client */
module.exports = (client) => {
    const configFiles = fs.readdirSync('./configs').filter((file) => file.endsWith('.js'));
    configFiles.forEach((file) => {
        const config = require(`../configs/${file}`);
        client.configs.set(config.id, config);
    });
};
