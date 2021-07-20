const Discord = require('discord.js');
const { client, prefix } = require('./app');
const quotes = ['Yesterday is history,tomorrow is a mystery,and today is a gift...thats why they call it present',
	'If you only do what you can do, you will never be more than who you are',
	'Your story may not have such a happy beginning but that does not make you who you are, it is the rest of it- who you choose to be',
	'One often meets his destiny on the road he takes to avoid it',
	'There is no secret ingredient, its just you'];

client.on('ready', () => {
	console.log('Bot Is Ready!');
});

// Listening to a new user
client.on('guildMemberAdd', member => {
	// Send the message to a designated channel on a server:
	const channel = member.guild.channels.cache.find(ch => ch.name === 'member-log');
	// Do nothing if the channel wasn't found on this server
	if (!channel) return;
	// Send the message, mentioning the member
	channel.send(`Welcome to the DSC server, ${member}`);
});

// listening to messages
client.on('message', (message) => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(' ');
	const command = args.shift().toLowerCase();

	if (command === 'master') {
		const i = Math.floor(Math.random() * 7);
		const msg = quotes[i];
		message.channel.send(msg);
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

			return message.channel.send(formattedMessage, {
				embed: {
					thumbnail: {
						url: member.user.displayAvatarURL(),
						color: member.displayHexColor,
					},
				},
			});
		}
	}
	else if (command === 'find-role') {
		if (!args.length) { return message.channel.send(`You didn't specify any role, ${message.author}!`); }
		else {
			let users = [];
			// eslint-disable-next-line no-shadow

			// TODO: Fix permissions of bot , currently only the user who calls this command has his name shown
			const role = (message.guild.roles.cache.find(e_role => e_role.name === args[0]));
			users = role === undefined ? ['No Role Found'] : role.members.map(m => m.displayName);

			users = users.length == undefined || users.length == 0 ? 'No User Found' : users.join('\n');

			const embed = new Discord.MessageEmbed({
				'title': `Users with the ${args[0]} role`,
				'description': users,
				'color': 0xFFFF,
			});
			return message.channel.send({ embed });
		}
	}
	else if (message.content === `${prefix}server`) {
		message.channel.send(`Server Name: ${message.guild.name} \n Total members: ${message.guild.memberCount} \n No: of channels : ${message.guild.member} \n Server Region ${message.guild.region}`);
	}
});
