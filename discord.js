const Discord = require("discord.js");
const fs = require("fs");
const colors = require("./utils/colors");
require("dotenv").config();
const { prefix, token } = JSON.parse(process.env.CONFIG);
const client = new Discord.Client();
client.login(token);

client.commands = new Discord.Collection();
const commandFiles = fs
  .readdirSync("./commands/")
  .filter((file) => file.endsWith(".js"));
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on("ready", () => console.log("Bot Is Ready!"));

// Listening to a new user
client.on("guildMemberAdd", (member) => {
  // Send the message to a designated channel on a server:
  const channel = member.guild.channels.cache.find(
    (ch) => ch.name === "member-log"
  );
  // Do nothing if the channel wasn't found on this server
  if (!channel) return;
  // Send the message, mentioning the member
  channel.send(`Welcome to the DSC server, ${member}`);
});

// listening to messages
client.on("message", async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase();

  const commandFile = client.commands.get(command);
  console.log(`Recieved command: !${command} from: ${message.author.username}`);
  if (!commandFile) {
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
    message.channel.send({ embed });
    return;
  }

  try {
    await commandFile.execute(message, args);
  } catch (e) {
    console.error('Error Occured', e);
    let embed = new Discord.MessageEmbed({
      title: "Error Occured",
      description: `I am not feeling too well my friend`,
      color: colors.red,
    });
    message.channel.send({ embed });
    return;
  }
});
