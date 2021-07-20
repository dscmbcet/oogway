const Discord = require("discord.js");
const fs = require("fs");
const { client, prefix } = require("./app");

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
<<<<<<< HEAD
client.on('message', (message) => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();

	if (command === 'ping') {
		message.channel.send('Pong.');
	}
	else if (command === 'args-info') {
		if (!args.length) {
			return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
		}
		message.channel.send(`First argument: ${args[0]}`);
	}
	else if (command === 'kick') {
		if (!message.mentions.users.size) { return message.reply('You need to tag someone!'); }
		const taggedUser = message.mentions.users.first();
		message.channel.send(`You wanted to kick : ${taggedUser.username}`);
	}
	else if (command === 'avatar') {
		if (!message.mentions.users.size) { return message.channel.send(`Your avatar: <${message.author.displayAvatarURL({ format: 'png', dynamic: true })}>`); }
	}
	else if (command === 'user-info') {
		if (!args.length) { return message.channel.send(`You didn't tag a user, ${message.author}!`); }
		else {
			const taggedUser = message.mentions.users.first();
			const member = message.guild.member(taggedUser);
			const joinedDate = new Date(member.joinedAt);
			const joinedDateFormatted = `${joinedDate.getDate()}-${joinedDate.getMonth() + 1}-${joinedDate.getFullYear()}`;
			const formattedMessage = [
				`**User ID**: ${member.id}`,
				`**Display Name**: ${member.displayName}`,
				`**Nickname**: ${member.nickname == null ? '-' : member.nickname}`,
				`**Highest Role**: ${member.roles.highest.name}`,
				`**Joined sever on**: ${joinedDateFormatted}`,
			];

			const embed = new Discord.MessageEmbed({
				description: formattedMessage.join('\n'),
				color: 0xFFFF,
				thumbnail: {
					url: member.user.displayAvatarURL(),
				},
			}).setColor(member.roles.color.hexColor);

			return message.channel.send({ embed });
		}
	}
	else if (command === 'find-role') {
		if (!args.length) { return message.channel.send(`You didn't specify any role, ${message.author}!`); }
		else {
			// eslint-disable-next-line no-shadow
			let embed;
			try {
				const roleID = message.mentions.roles.first().id;
				const roleName = message.mentions.roles.first().name;
				const role = (message.guild.roles.cache.find(e_role => e_role.id === roleID));
				let users = role === undefined ? ['No Role Found'] : role.members.map(m => m.displayName).sort();

				users = users.length == undefined || users.length == 0 ? 'No User Found' : users.join('\n');
				embed = new Discord.MessageEmbed({
					'title': `Users with the '@${roleName}' role`,
					'description': users,
					'color': 0xFFFF,
				}).setColor(role.hexColor);
			}
			catch {
				embed = new Discord.MessageEmbed({
					'title': 'Invalid Role',
					'color': 0xFFFF,
				});
			}

			return message.channel.send({ embed });
		}
	}
	else if (command === 'poll') {
		if (args.length < 2) { return message.channel.send(`Invalid Syntax, ${message.author}!`); }
		else {
			// eslint-disable-next-line no-shadow
			let embed;
			const emojiArr = ['👍', '👎', '0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
			const poll_no = args[0];

			args.splice(0, 1);
			const description = args.join(' ');

			if (poll_no == 0) {
				embed = new Discord.MessageEmbed({
					title: 'POLL : Can\'t Be Zero',
					color: 0xeb0707,
				});
			}
			else if (poll_no > emojiArr.length) {
				embed = new Discord.MessageEmbed({
					title: `POLL : Can't Be Greater Than ${emojiArr.length}`,
					color: 0xeb0707,
				});
			}
			else {
				embed = new Discord.MessageEmbed({
					title: 'Poll',
					description: `**${description}**\n\n_Created by @${message.author.username}_`,
					color: 0xeb9e34,
				});
			}

			return message.channel.send({ embed }).then(async embedMessage => {
				if (!(poll_no === 0 || poll_no > emojiArr.length)) {
					for (let i = 0; i < poll_no; i++) {await embedMessage.react(emojiArr[i]);}
				}
			});
		}
	}
	else if (message.content === `${prefix}server`) {
		message.channel.send(`Server Name: ${message.guild.name} \n Total members: ${message.guild.memberCount} \n No: of channels : ${message.guild.member} \n Server Region ${message.guild.region}`);
	}
=======
client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;
  const args = message.content.slice(prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase();

  const commandFile = client.commands.get(command);
  commandFile !== undefined ? commandFile.execute(message, args) : null;
>>>>>>> f97d96d1ec23ebd4aee591d0b50c9b35731f2f74
});
