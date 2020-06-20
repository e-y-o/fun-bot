/**
 * Sends a tweet indicated by the arguments as an embedded message into the channel from which the command was sent.
 * Sources: None
 */
const Discord = require('discord.js'); // require discord.js
const { t } = require('../index.js');
module.exports = {
	name: 'twitter',
	aliases: ['t'],
	description: 'Get tweets from user',
	usage: '<@username> [replies | -r ] [index]',
	args: true,
	cooldown: 3,
	execute(message, args) {
		const parameters = { exlude_replies: true, include_rts: false, count: 25 };
		const footerFile = new Discord.MessageAttachment('./assets/Twitter_Logo_Blue.png', 'footer.png');
		let index = 0;
		let original = true;

		while(args.length > 0) {
			if(args[0].startsWith('@')) {
				parameters.screen_name = args.shift().substring(1);
			}
			else if(args[0] == '-r' || args[0] == 'replies') {
				original = false;
				args.shift();
			}
			else if(args[0].match(/^-{0,1}\d+$/) && args[0] < parameters.count) {
				index = args.shift();
			}
			else {
				args.shift();
			}
		}

		// eslint-disable-next-line no-unused-vars
		t.get('statuses/user_timeline', parameters, function(error, tweets, response) {
			if(!error) {
				if(original) {
					while(tweets[index].in_reply_to_screen_name != null) {
						++index;
					}
					if(index >= parameters.count) {
						message.channel.send('All of this user\'s recent tweets are replies.');
					}
				}
				tweetToEmbed(tweets[index]);
				// console.log(tweets[index]);
			}
		});

		function tweetToEmbed(tweet) {
			const sourceSubstring = tweet.source.substring(tweet.source.indexOf('>') + 1, tweet.source.indexOf('</a>'));
			let userName = tweet.user.name;
			// console.log(tweet.entities.urls);
			// console.log(tweet.entities.media[0]);
			if(tweet.user.verified) {
				userName += ' ✓';
			}
			const myEmbed = new Discord.MessageEmbed()
				.setColor('#0099ff')
				.setAuthor(userName + '  (@' + tweet.user.screen_name + ')', tweet.user.profile_image_url_https, 'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str)
				.setDescription(tweet.text.replace(/&amp;/g, '&'))
				.addField('Retweets', tweet.retweet_count, true)
				.addField('Likes', tweet.favorite_count, true)
				.setFooter(sourceSubstring, 'attachment://footer.png')
				.setTimestamp(tweet.created_at);

			message.channel.send({ files: [footerFile], embed: myEmbed });
		}
	},
};