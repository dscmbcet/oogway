const Discord = require("discord.js");
const { prefix } = require("../utils/functions");
module.exports = {
    name: 'ready',

    /** @param {Discord.Client} client */
    execute(client) {
        const guilds = client.guilds.cache.map(guild => `${guild.name}:${guild.id}`);
        if (prefix === '!') console.warn('\x1b[31m\x1b[1m%s\x1b[0m', 'PRODUCTION_MODE')
        else console.warn('\x1b[33m\x1b[1m%s\x1b[0m', 'DEVELOPMENT_MODE');
        console.log("Master Oogway Is Ready!");
        console.log(`Prefix: ${prefix}`);
        console.log(`Handling Guilds:`, guilds.join(', '));
    }
}