const Discord = require("discord.js");
module.exports = {
    name: 'ready',

    /** @param {Discord.Client} client */
    execute(client) {
        const guilds = client.guilds.cache.map(guild => `${guild.name}:${guild.id}`);
        console.log("Master Oogway Is Ready!");
        console.log("Handling Guilds:", guilds.join(', '));
    }
}