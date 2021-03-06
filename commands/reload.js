/**
 * Reloads command indicated by first argument.
 * Sources: Discord.js
 */
module.exports = {
	name: 'reload',
	description: 'Reloads a command',
	args: true,
	perms: ['ADMINISTRATOR', 'SEND_MESSAGES'],
	execute(message, args) {
		const commandName = args[0].toLowerCase(); // command to be reloaded
		const command = message.client.commands.get(commandName)
			|| message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

		// Behavior if command does not exist
		if (!command) {
			return message.channel.send(`${message.author}: there is no command with name or alias \`${commandName}\``);
		}

		delete require.cache[require.resolve(`./${command.name}.js`)];

		// Behavior if command is found. Attempts to reload command
		try {
			const newCommand = require(`./${command.name}.js`);
			message.client.commands.set(newCommand.name, newCommand);
			message.channel.send(`Command \`${command.name}\` was reloaded`);
		}
		catch (error) {
			console.log(error);
			message.channel.send(`There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``);
		}
	},
};