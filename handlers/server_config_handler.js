const fs = require('fs');
const Discord = require("discord.js");

/** @param {Discord.Client} client */
module.exports = (client) => {
    const configFiles = fs.readdirSync('./configs').filter(file => file.endsWith('.js'));
    for (const file of configFiles) {
        const config = require(`../configs/${file}`);
        client.configs.set(config.id, config);
    }
}