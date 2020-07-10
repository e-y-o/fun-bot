/**
 * Sends a specified Twitter user's profile as an embedded message into the channel the command was sent.
 * Sources: None
 */
const Discord = require('discord.js'); // require discord.js
const { t } = require('../index.js');
module.exports = {
	name: 'twitterprofile',
	aliases: ['tp'],
	description: 'Get a user\'s twitter profile',
	usage: '<username>',
	args: true,
	cooldown: 3,
	perms: ['SEND_MESSAGES'],
	execute(message, args) {
		const footerFile = new Discord.MessageAttachment('./assets/Twitter_Logo_Blue.png', 'footer.png');
		const parameters = {};
		if(args[0].startsWith('@')) {
			parameters.screen_name = args[0].substring(1);
		}
		else {
			parameters.screen_name = args[0];
		}
		// eslint-disable-next-line no-unused-vars
		t.get('users/show', parameters, function(error, user, response) {
			if(!error) {
				let userName = user.name;
				console.log(user.entities.url);
				let text = user.description.replace(/&amp;/g, '&');
				text = text.replace(/(@\S+)/gi, 'https://twitter.com/');
				if(user.entities.description != null) {
					for(let i = 0; i < user.entities.description.urls.length; ++i) {
						text = text.replace(user.entities.description.urls[i].url, '[' + user.entities.description.urls[i].display_url + '](' + user.entities.description.urls[i].expanded_url + ')');
					}
				}
				if(user.verified) {
					userName += ' ✓';
				}
				const myEmbed = new Discord.MessageEmbed()
					.setColor('#0099ff')
					.setAuthor(userName + '  (@' + user.screen_name + ')', user.profile_image_url_https, 'https://twitter.com/' + user.screen_name)
					.setDescription(text)
					.setFooter('Joined Twitter:', 'attachment://footer.png')
					.setTimestamp(user.created_at);

				let leftfield = '\u200B';
				let rightfield = '\u200B';
				let followingcount = user.friends_count;
				if(~~(followingcount / 1000000) > 0) {
					followingcount = (followingcount / 1000000).toFixed(1) + 'M';
				}
				else if(~~(followingcount / 1000) > 0) {
					followingcount = (followingcount / 1000).toFixed(1) + 'K';
				}
				let followercount = user.followers_count;
				if(~~(followercount / 1000000) > 0) {
					followercount = (followercount / 1000000).toFixed(1) + 'M';
				}
				else if(~~(followercount / 1000) > 0) {
					followercount = (followercount / 1000).toFixed(1) + 'K';
				}

				if(user.location != '') {
					leftfield = ':round_pushpin: ' + user.location;
					if(user.url != null) {
						rightfield = ':link: ' + user.entities.url.urls[0].display_url;
					}
				}
				else if(user.url != null) {
					leftfield = ':link: ' + user.entities.url.urls[0].display_url;
				}

				if(user.profile_banner_url != null) {
					myEmbed.setImage(user.profile_banner_url);
				}
				myEmbed.addFields(
					{ name: leftfield, value: followingcount + ' Following', inline: true },
					{ name: rightfield, value: followercount + ' Followers', inline: true },
				);
				message.channel.send({ files: [footerFile], embed: myEmbed });
			}
			else {
				message.channel.send('User \'' + args[0] + '\' not found.');
			}
		});
	},
};