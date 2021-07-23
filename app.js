require("dotenv").config();
const Discord = require("discord.js");
const fs = require("fs");
const { token } = JSON.parse(process.env.CONFIG);

const client = new Discord.Client();
client.login(token);

client.commands = new Discord.Collection();
client.events = new Discord.Collection();

const handleFiles = fs.readdirSync('./handlers').filter(file => file.endsWith('.js'));
for (const file of handleFiles) require(`./handlers/${file}`)(client);