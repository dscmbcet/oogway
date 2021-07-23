const fs = require('fs');
const Discord = require("discord.js");

/** @param {Discord.Client} client */
module.exports = (client) => {
    const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
    for (const file of eventFiles) {
        const event = require(`../events/${file}`);
        client.on(event.name, async (...args) => {
            try { await event.execute(...args, client) }
            catch (e) { console.error(`Event ${event.name} Error: ${e.name}: ${e.message}`) }
        });
    }
}