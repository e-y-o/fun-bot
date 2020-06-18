const pullr = require('./reddit.js');

module.exports = {
	name: 'roulettereddit',
	aliases: ['rroll', 'rr'],
	description: 'Pull a fixed number of random posts from specified subreddit.',
	args: true,
	cooldown: 10,
	usage: '<subreddit> [sort] [time]',
	execute(message, args) {
		const NUM_TO_GET = 4; // number of random posts to fetch
		let sendingArgs = args;

		if(args.length == 1) {
			sendingArgs = [args[0], 'random'];
		}
		else if(args.length == 4) {
			message.channel.send('Usage: ' + this.usage);
			return;
		}

		message.channel.send('Rolling ' + NUM_TO_GET + ' posts from ' + args[0] + ':');
		for(let i = 0; i < NUM_TO_GET; ++i) {
			pullr.execute(message, [...sendingArgs]);
		}
	},
};