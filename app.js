require("dotenv").config();
const Discord = require("discord.js");
const fs = require("fs");
const { token } = JSON.parse(process.env.CONFIG);

const client = new Discord.Client();
client.login(token);

// Handling Events
const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) client.once(event.name, async (...args) => {
    try { await event.execute(...args, client) }
    catch (e) { console.error(`Event ${event.name} Error: ${e.name}: ${e.message}`) }
  });
  else client.on(event.name, async (...args) => {
    try { await event.execute(...args, client) }
    catch (e) { console.error(`Event ${event.name} Error: ${e.name}: ${e.message}`) }
  });
}

// Commands are handled in events/message