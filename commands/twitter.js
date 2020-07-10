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
	perms: ['SEND_MESSAGES'],
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
				if(!original) {
					while(index < (tweets.length - 1) && tweets[index].in_reply_to_screen_name != null) {
						++index;
					}
					if(index >= parameters.count) {
						message.channel.send('All of this user\'s recent tweets are replies.');
					}
				}
				if(index >= tweets.length) {
					index = tweets.length - 1;
				}
				tweetToEmbed(tweets[index]);
				// console.log(tweets[index]);
			}
			else {
				message.channel.send('User \'' + args[0] + '\' not found');
			}
		});

		function tweetToEmbed(tweet) {
			const sourceSubstring = tweet.source.substring(tweet.source.indexOf('>') + 1, tweet.source.indexOf('</a>'));
			let userName = tweet.user.name;
			if(tweet.user.verified) {
				userName += ' ✓';
			}

			let text = tweet.text.replace(/&amp;/g, '&');
			if(tweet.entities.urls != null) {
				for(let i = 0; i < tweet.entities.urls.length; ++i) {
					text = text.replace(tweet.entities.urls[i].url, '[' + tweet.entities.urls[i].display_url + '](' + tweet.entities.urls[i].expanded_url + ')');
				}
			}
			if(tweet.entities.media != null && tweet.entities.media.length != 0) {
				myEmbed.setImage(tweet.entities.media[0].media_url_https);
				text = text.replace(tweet.entities.media[0].url, '');

			}
			if(tweet.entities.hashtags != null) {
				for(let i = 0; i < tweet.entities.hashtags.length; ++i) {
					text = text.replace('#' + tweet.entities.hashtags[i].text, '[#' + tweet.entities.hashtags[i].text + '](https://twitter.com/hastags' + tweet.entities.hashtags[i].text + ')');
				}
			}
			if(tweet.entities.user_mentions != null) {
				for(let i = 0; i < tweet.entities.user_mentions.length; ++i) {
					text = text.replace('@' + tweet.entities.user_mentions[i].screen_name, '[@' + tweet.entities.user_mentions[i].screen_name + '](https://twitter.com/' + tweet.entities.user_mentions[i].screen_name + ')');
				}
			}

			let likecount = tweet.favorite_count;
			if(~~(likecount / 1000000) > 0) {
				likecount = (likecount / 1000000).toFixed(1) + 'M';
			}
			else if(~~(likecount / 1000) > 0) {
				likecount = (likecount / 1000).toFixed(1) + 'K';
			}

			let retweetcount = tweet.retweet_count;
			if(~~(retweetcount / 1000000) > 0) {
				retweetcount = (retweetcount / 1000000).toFixed(1) + 'M';
			}
			else if(~~(retweetcount / 1000) > 0) {
				retweetcount = (retweetcount / 1000).toFixed(1) + 'K';
			}
			// console.log(tweet.entities.urls);
			// console.log(tweet.entities.media[0]);
			console.log(tweet.entities);
			const myEmbed = new Discord.MessageEmbed()
				.setColor('#0099ff')
				.setAuthor(userName + '  (@' + tweet.user.screen_name + ')', tweet.user.profile_image_url_https, 'https://twitter.com/' + tweet.user.screen_name + '/status/' + tweet.id_str)
				.setDescription(text)
				.addField('Retweets', retweetcount, true)
				.addField('Likes', likecount, true)
				.setFooter(sourceSubstring, 'attachment://footer.png')
				.setTimestamp(tweet.created_at);

			message.channel.send({ files: [footerFile], embed: myEmbed });
		}
	},
};