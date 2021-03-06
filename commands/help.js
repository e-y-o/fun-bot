/**
 * Sends list of commands or execution information for a specific command.
 * Sources: Discord.js
 */
const { prefix } = require('../config.json');
module.exports = {
	name: 'help',
	description: 'List all commands or info about a specific command.',
	aliases: ['commands'],
	usage: '[command name]',
	cooldown: 5,
	perms: ['SEND_MESSAGES'],
	execute(message, args) {
		const data = [];
		const { commands } = message.client;

		if (!args.length) {
			data.push('Here is a list of all my commands:');
			data.push(commands.map(command => command.name).join(', '));
			data.push(`\nSend \`${prefix}help [command name]\` to get info on a specific command`);

			return message.author.send(data, { split: true })
				.then(() => {
					if (message.channel.type === 'dm') return;
					// message.reply('I\'ve sent you a DM with all my commands!');
				})
				.catch(error => {
					console.error(`Could not send help DM to ${message.author.tag}.\n`, error);
					message.reply('Could not send help message to ' + message.author.tag + '. Please enable DMs or unblock the bot.');
				});
		}

		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

		if (!command) {
			return message.reply(name + ' is not a valid command');
		}

		data.push(`**Name:** ${command.name}`);

		if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
		if (command.description) data.push(`**Description:** ${command.description}`);
		if (command.usage) data.push(`**Usage:** ${prefix}${command.name} ${command.usage}`);

		data.push(`**Cooldown:** ${command.cooldown || 3} second(s)`);

		message.channel.send(data, { split: true });
	},
};