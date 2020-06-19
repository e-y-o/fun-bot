const { client } = require('../index.js');
const checker = require('../helpers/permcheck.js');
module.exports = {
	name: 'botset',
	description: 'Set certain bot properties, like its name, avatar, and activity.',
	aliases: ['bs'],
	usage: '<name | avatar | activity> [activity type] <username | url/path | activity>',
	args: true,
	perms: ['ADMINISTRATOR'],
	execute(message, args) {
		if(!checker.checkPerms(message, this.perms)) {
			return;
		}
		switch(args[0]) {
		case 'name':
			client.user.setUsername(args[1])
				.then(user => console.log(`username set to ${user.username}`))
				.then(user => message.channel.send('Username was set to "' + user + '".'))
				.catch(console.error);
			break;
		case 'avatar':
			client.user.setAvatar(args[1])
				.then(console.log(`avatar set`))
				.then(message.channel.send('Avatar was set.'))
				.catch(console.error);
			break;
		case 'activity':
			if(args.length >= 3) {
				const TYPES = Object.freeze(['PLAYING', 'STREAMING', 'LISTENING', 'WATCHING']);
				if(TYPES.indexOf(args[1].toUpperCase()) !== -1) {
					client.user.setActivity(args[2], { type: args[1].toUpperCase() })
						.then(presence => console.log(`activity set to ${presence.activities[0].name}`))
						.then(message.channel.send('Activity was set.'))
						.catch(console.error);
				}
			}
			else {
				client.user.setActivity(args[1])
					.then(presence => console.log(`activity set to ${presence.activities[0].name}`))
					.then(message.channel.send('Activity was set.'))
					.catch(console.error);
			}
			break;
		default:
			message.channel.send('usage: ' + this.usage);
		}
	},
};
