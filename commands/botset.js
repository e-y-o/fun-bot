const { Discord } = require('discord.js');
const { client } = require('../index.js');
module.exports = {
	name: 'botset',
	description: 'List all commands or info about a specific command.',
	aliases: ['bs'],
	usage: '<name | avatar | activity> [activity type] <username | url/path | activity>',
	args: true,
	execute(message, args) {
		switch(args[0]) {
			case 'name':
				client.user.setUsername(args[1])
				.then(user => console.log(`username set to ${user.username}`))
				.catch(console.error);
				break;
			case 'avatar':
					client.user.setAvatar(args[1])
					.then(user => console.log(`avatar set`))
					.catch(console.error);
				break;
			case 'activity':
				if(args.length >= 3) {
					const TYPES = Object.freeze(['PLAYING', 'STREAMING', 'LISTENING', 'WATCHING'])
					if(TYPES.indexOf(args[1].toUpperCase()) !== -1) {
						client.user.setActivity(args[2], { type: args[1].toUpperCase() })
						.then(presence => console.log(`activity set to ${presence.activities[0].name}`))
						.catch(console.error);;
					}
				}
				else {
					client.user.setActivity(args[1])
					.then(presence => console.log(`activity set to ${presence.activities[0].name}`))
					.catch(console.error);
				}
				break;
			default:
				message.channel.send('usage: ' + this.usage);
		}
	},
};
