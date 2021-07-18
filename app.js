require('dotenv').config();
var express = require('express');
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.get('/', (req, res) => res.sendFile(__dirname + '/routes/index.html'));

const { prefix, token } = JSON.parse(process.env.CONFIG);
const Discord = require('discord.js');
const client = new Discord.Client();
client.login(token);

module.exports = { app, client, prefix}

require("./discord");