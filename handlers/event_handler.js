const fs = require('fs');
const Discord = require('discord.js');
const { prefix } = require('../utils/functions');
const { test_server_id } = require('../config');

/** @param {Discord.Client} client */
module.exports = client => {
    const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const event = require(`../events/${file}`);
        client.on(event.name, async (...args) => {
            if (productionRequests(...args)) return;
            try {
                await event.execute(...args, client);
            } catch (e) {
                console.error(`Event ${event.name} Error: ${e.name}: ${e.message}`);
            }
        });
    }
    const productionRequests = parameter => (!parameter ? false : !parameter.guild ? false : prefix === '~' && parameter.guild.id !== test_server_id);
};
