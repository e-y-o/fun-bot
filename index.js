/**
 * This is a simple bot which pulls reddit content and pushes it to a discord channel as an embed.
 * Uses discord.js, Twitter for Node.js snoowrap.js
 * Sources: Discord.js
 */
const fs = require('fs');
const { prefix, token, userAgent, clientId, clientSecret, refreshToken, consumerKey, consumerSecret, bearerToken } = require('./config.json'); // config file
// require snoowrap.js module. snoowrap is included here rather than in a command file because it requires login tokens.
const snoowrap = require('snoowrap');
const Discord = require('discord.js'); // require the discord.js module
const Twitter = require('twitter');

const client = new Discord.Client(); // create a new discord client
// create a new snoowrap  requester
const r = new snoowrap({
	userAgent: userAgent,
	clientId: clientId,
	clientSecret: clientSecret,
	refreshToken: refreshToken,
});
// create Twitter client
const t = new Twitter({
	consumer_key: consumerKey,
	consumer_secret: consumerSecret,
	bearer_token: bearerToken,
});
module.exports = { r, t, client };

client.commands = new Discord.Collection(); // retrieve command files
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}
const cooldowns = new Discord.Collection();

// when the client is ready, run this code once
client.once('ready', () => {
	client.user.setActivity(prefix + 'help', 'PLAYING');
	console.log('Ready!');
});

client.on('message', message => {
	// if the message was sent by a bot or does not start with prefix, exit
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).split(/ +/); // create an args variable that slices off the prefix and splits it into an array by spaces
	const commandName = args.shift().toLowerCase(); // create a command variable which will take the first element in the array and remove and return it

	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

	if (!command) return;

	if (command.guildOnly && message.channel.type !== 'text') {
		return message.reply('That command cannot be executed from within DMs');
	}

	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${message.author}`;

		if (command.usage) {
			reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}\``;
		}

		return message.channel.send(reply);
	}

	if(command.perms) {
		if(!message.member.hasPermission('ADMINISTRATOR')) {
			for(let i = 0; i < command.perms.length; ++i) {
				if(!message.member.guild.me.hasPermission(command.perms[i])) {
					return message.reply('you do not have required permissions to execute that command.');
				}
			}
		}
		if(!message.member.guild.me.hasPermission('ADMINISTRATOR')) {
			for(let i = 0; i < command.perms.length; ++i) {
				if(!message.member.guild.me.hasPermission(command.perms[i])) {
					return message.channel.send('I do not have required permissions to execute that command.');
				}
			}
		}
	}

	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
		}
	}

	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		command.execute(message, args);
	}
	catch (error) {
		console.error(error);
		message.reply('There was an error trying to execute that command. Do `' + prefix + 'help` for help executing commands.');
	}
});

// login to Discord with app token
client.login(token);