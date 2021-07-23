const Discord = require("discord.js");
const fs = require("fs");
const colors = require("../utils/colors");
const { prefix } = JSON.parse(process.env.CONFIG);

module.exports = {
    name: 'message',

    /** 
     * @param {Discord.GuildMember} message
     * @param {Discord.Client} client
     * */
    async execute(message, client) {
        // Getting commands from ./commands
        client.commands = new Discord.Collection();
        const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);
            client.commands.set(command.name, command);
        }

        if (!message.content.startsWith(prefix) || message.author.bot) return;
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
            return message.channel.send({ embed });
        }

        try { await commandFileData.execute(message, args, client) }
        catch (e) {
            console.error(`${command} Error: ${e.name}: ${e.message}`);
            let embed = new Discord.MessageEmbed({
                title: "Error Occured",
                description: `I am not feeling too well my friend`,
                color: colors.red,
            });
            return message.channel.send({ embed });
        }
    }
}