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
client.on("guildMemberAdd", async (member) => {
  const channel = member.guild.channels.cache.find((ch) => ch.name === 'welcome🤝');
  var memberRole = member.guild.roles.cache.find(role => role.name === "Member");
  if (memberRole) member.roles.add(memberRole);

  if (!channel) return;
  let embed = new Discord.MessageEmbed({
    title: `A new member just arrived!`,
    description: [
      `Welcome ${member} we hope you enjoy your stay here!`,
      `I am **Master Oogway**, bot of GDSC MBCET`,
      `\nTo get to know me type: \`!help-v\``
    ].join('\n'),
    thumbnail: {
      url: member.user.displayAvatarURL(),
    },
    color: colors.cyan
  });

  await channel.send(embed);

  embed = new Discord.MessageEmbed({
    title: `GDSC MBCET`,
    color: colors.orange,
    thumbnail: {
      url: member.guild.iconURL(),
    },
    description: [
      `Welcome ${member} we hope you enjoy your stay here!`,
      `I am **Master Oogway**, bot of GDSC MBCET`,
      `\nTo get to know me type: \`!help-v\` in GDSC Discord Channel`
    ].join('\n'),
  })

  return await member.send(embed);
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
