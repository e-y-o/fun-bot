const Discord = require('discord.js'); // require discord.js
const { r } = require('../index.js'); // take snoowrap from main class
module.exports = {
	name: 'reddit',
	aliases: ['r'],
	description: 'Pull content from specified subreddit',
	args: true,
	usage: '<subreddit> [sort] [time] [post index]',

	execute(message, args) {
		const PULL_LIMIT = 25; // limit to the number of posts this command will pull
		const MAX_TEXT_LENGTH = 1000; // maximum character length for embedded text
		const SORTS = Object.freeze(['hot', 'top', 'new', 'random']); // array of possible sorts
		const TIMES = Object.freeze(['day', 'week', 'month', 'year', 'all']); // array of possible times
		const subName = args.shift(); // name of subreddit
		let sort = 'hot'; // sorting type, default is hot
		let time = 'week'; // sorting date, default is week
		let postIdx = Math.floor(Math.random() * PULL_LIMIT); // index of post on page, defaults to random
		let myListing; // snoowrap content listing

		// parse arguments
		while(args.length > 0) {
			if(SORTS.indexOf(args[0]) !== -1) {
				sort = args.shift();
			}
			else if(args[0].match(/^-{0,1}\d+$/)) {
				postIdx = parseInt(args.shift()) - 1;
			}
			else if(TIMES.indexOf(args[0] !== -1)) {
				time = args.shift();
			}
			else {
				break;
			}
		}

		// pull a submission based on arguments and upload embedded message
		switch(sort) {
		case 'hot':
			myListing = r.getSubreddit(subName).getHot({ limit: PULL_LIMIT });
			myListing.get(postIdx).then(extract);
			break;
		case 'top':
			myListing = r.getSubreddit(subName).getTop({ time: time }, { limit: PULL_LIMIT });
			myListing.get(postIdx).then(extract);
			break;
		case 'new':
			myListing = r.getSubreddit(subName).getNew({ limit: PULL_LIMIT });
			myListing.get(postIdx).then(extract);
			break;
		case 'random':
			myListing = r.getRandomSubmission(subName).then(extract);
			break;
		default:
			message.channel.send('Usage: ' + this.usage);
		}

		/**
		 * Send a Discord message containing embedded data pulled from the parameter.
		 * @param {Submission} post the post whose content will be extracted and uploaded.
		 */
		function extract(post) {
			if(post == null) {
				message.channel.send('Subreddit does not exist.');
				return;
			}
			else {
				const postJSON = post.toJSON();
				let mainText;
				if(post.link_flair_text != null) {
					mainText = postJSON.link_flair_text;
				}
				else if(post.selftext != '') {
					if(post.toJSON().selftext.length > MAX_TEXT_LENGTH) {
						mainText = postJSON.selftext.substring(0, MAX_TEXT_LENGTH) + '...';
					}
					else {
						mainText = postJSON.selftext;
					}
				}
				else {
					mainText = '\u200B';
				}

				const myEmbed = new Discord.MessageEmbed()
					.setColor('#0099ff')
					.setTitle(post.title)
					.setURL('https://reddit.com' + post.permalink)
					.setAuthor(post.author.toJSON().name, getRandomIcon())
					.setFooter('Reddit', 'https://www.redditinc.com/assets/images/site/reddit-logo.png')
					.addField(post.subreddit_name_prefixed, mainText, false)
					.addField('Score', postJSON.score, true)
					.addField('Comments', postJSON.num_comments, true)
					.setTimestamp(getTimeStamp(post));
				attachImage(myEmbed, postJSON);

				message.channel.send(myEmbed);
			}
		}

		/**
		 * Pull images/gifs from the specified post and put them in the parameter embed.
		 * @param {MessageEmbed} embed the message in which images should be embedded
		 * @param {Submission} post the post from which images will be extracted
		 */
		function attachImage(embed, post) {
			if(post.url.substring(post.url.length - 3) == 'jpg' || post.url.substring(post.url.length - 3) == 'png' || post.url.substring(post.url.length - 3) == 'gif') {
				embed.setImage(post.url);
			}
			else if(post.url.substring(post.url.length - 4) == 'gifv') {
				embed.setImage(post.url.substring(0, post.url.length - 1));
			}
			else if(post.media != null) {
				if(post.media.oembed.provider_url == 'https://gfycat.com') {
					if(post.over_18 == false) {
						embed.attachFiles(new Discord.MessageAttachment(post.media.oembed.thumbnail_url, 'file.gif'));
						embed.setImage('attachment://file.gif');
					}
					else {
						embed.attachFiles(new Discord.MessageAttachment('https://thcf1.redgifs.com' + post.media.oembed.thumbnail_url.substring(post.media.oembed.provider_url.length + 7), 'file.gif'));
						embed.setImage('attachment://file.gif');
					}
				}
				else if(post.media.oembed.provider_url == 'https://www.youtube.com/') {
					embed.setImage(post.media.oembed.thumbnail_url);
				}
				else {
					embed.setImage(post.thumbnail);
				}
			}
		}

		/**
		 * Get a random icon from reddit's default profile pictures
		 */
		function getRandomIcon() {
			const NUM_DEFAULT_ICONS = 20; // number of default icons reddit has
			const NUM_DEFAULT_COLORS = 24; // number of default icon colors reddit has
			const RAND_COLOR = Math.floor(Math.random() * NUM_DEFAULT_COLORS) + 1;
			let randDesign;
			const HEX_CODES = Object.freeze({
				1: 'A5A4A4',
				2: '545452',
				3: 'A06A42',
				4: 'C18D42',
				5: 'FF4500',
				6: 'FF8717',
				7: 'FFB000',
				8: 'FFD635',
				9: 'DDBD37',
				10: 'D4E815',
				11: '94E044',
				12: '46A508',
				13: '46D160',
				14: '0DD3BB',
				15: '25B79F',
				16: '008985',
				17: '24A0ED',
				18: '0079D3',
				19: '7193FF',
				20: '4856A3',
				21: '7E53C1',
				22: 'FF66AC',
				23: 'DB0064',
				24: 'EA0027',
				25: 'FF585B',
			});

			const randDesignNum = Math.floor(Math.random() * NUM_DEFAULT_ICONS) + 1; // picks a random icon design
			if(randDesignNum < 10) {
				randDesign = '0' + randDesignNum;
			}
			else {
				randDesign = randDesignNum;
			}

			const iconUrl = 'https://www.redditstatic.com/avatars/avatar_default_' + randDesign + '_' + HEX_CODES[RAND_COLOR] + '.png';
			return iconUrl;
		}

		/**
		 * Return timezone-corrected timestamp of the Submission parameter.
		 * @param {Submission} post the post whose timestamp will be returned
		 */
		function getTimeStamp(post) {
			const dt = new Date(); // used to get correct post date
			const timeOffset = dt.getTimezoneOffset(); // post date offset
			return post.created_utc * 1000 - timeOffset * 60000;
		}
	},
};