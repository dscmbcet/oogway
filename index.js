const { prefix, token } = require('./config.json');
const Discord = require('discord.js');


const client = new Discord.Client();

client.on('ready', ()=>{
	console.log('Ready!');
});

// listening to messages
client.on('message', (message)=>{
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
		else if(args[0] === 'foo') {
			return message.channel.send('bar');
		}

		message.channel.send(`First argument: ${args[0]}`);
	}
	else if (command === 'kick') {
		if (!message.mentions.users.size) {
			return message.reply('You need to tag someone!');
		}
		const taggedUser = message.mentions.users.first();
		message.channel.send(`You wanted to kick : ${taggedUser.username}`);
	}
	else if (command === 'avatar') {
		if (!message.mentions.users.size) {
			return message.channel.send(`Your avatar: <${message.author.displayAvatarURL({ format: 'png', dynamic: true })}>`);
		}

		const taggedUser = message.mentions.users.first();
	}
	// if(command === 'ping') {
	// 	message.channel.send('pong');
	// }
	// else if(command === 'args-info') {
	// 	if(!args.length) {
	// 		return message.channel.send(`You didn't provide any arguments,${message.author}`);
	// 	}
	// }
	// else if(message.content === `${ prefix }server`) {
	// 	message.channel.send(`Server Name: ${message.guild.name} \n Total members: ${message.guild.memberCount} \n No: of channels : ${message.guild.member} \n Server Region ${message.guild.region}`);
	// }
});

client.login(token);