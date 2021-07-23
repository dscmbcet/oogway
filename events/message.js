const Discord = require("discord.js");
const fs = require("fs");
const colors = require("../utils/colors");
const { prefix } = require("../utils/functions");

module.exports = {
    name: 'message',

    /** 
     * @param {Discord.Message} message
     * @param {Discord.Client} client
     * */
    async execute(message, client) {
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        //Disable DM's to Bot
        if (message.channel.type === 'dm') {
            let embed = new Discord.MessageEmbed({
                description: [
                    `I cannot serve you here my friend ${message.author}`,
                    'Text me within the \`GDSC MBCET\` server',
                ].join('\n'),
                color: colors.red,
            });
            return message.channel.send(embed)
        }

        // Getting commands from ./commands
        client.commands = new Discord.Collection();
        const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);
            client.commands.set(command.name, command);
        }

        const args = message.content.slice(prefix.length).trim().split(" ");
        const command = args.shift().toLowerCase();

        const commandFileData = client.commands.get(command);
        console.log(`Recieved command from:${message.author.username} , command: ${message.content} `);
        if (!commandFileData) {
            let embed = new Discord.MessageEmbed({
                title: "Invalid Command",
                description: [
                    '“There are no accidents”',
                    'But you my friend have made one',
                    'I will show you the way',
                    'Type: \`!help-v\`'
                ].join('\n'),
                color: colors.red,
            });
            return message.channel.send(embed);
        }

        try { await commandFileData.execute(message, args, client) }
        catch (e) {
            //console.log(e);
            console.error(`Command: ${command} Error: ${e.name}: ${e.message}`);
            let embed = new Discord.MessageEmbed({
                title: "Error Occured",
                description: `I am not feeling too well my friend`,
                color: colors.red,
            });
            return message.channel.send(embed);
        }
    }
}