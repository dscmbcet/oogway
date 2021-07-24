const Discord = require("discord.js");
const { reactionDataArray, removeReactionRole } = require("../firebase/firebase_handler");
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

        reactionDataArray.forEach(async e => {
            const guild = client.guilds.cache.find(guild => guild.id == e.guild_id);
            const channel = guild.channels.cache.find(channel => channel.id == e.channel_id);
            try { await channel.messages.fetch(e.id) }
            catch (error) { await removeReactionRole(e.id) }
        })
    }
}