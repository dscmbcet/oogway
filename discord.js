const Discord = require("discord.js");
const fs = require("fs");
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
client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase();

  const commandFile = client.commands.get(command);
  console.log(`Recieved command: !${command} from: ${message.author.username}`);
  if (!commandFile) {
    let embed = new Discord.MessageEmbed({
      title: "Invalid Command",
      description: `I usually say _"there are no mistakes"_\nBut you my child have made one\nMaybe I can guide you to the right path, type: \`help-v\``,
      color: 0xff0000,
    });
    message.channel.send({ embed });
    return;
  }

  try {
    commandFile.execute(message, args);
  } catch {
    let embed = new Discord.MessageEmbed({
      title: "Error Occured",
      description: `I am not feeling too well my friend`,
      color: 0xff0000,
    });
    message.channel.send({ embed });
    return;
  }
});
