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
				if(user.verified) {
					userName += ' ✓';
				}
				const myEmbed = new Discord.MessageEmbed()
					.setColor('#0099ff')
					.setAuthor(userName + '  (@' + user.screen_name + ')', user.profile_image_url_https, 'https://twitter.com/' + user.screen_name)
					.setDescription(user.description)
					.setFooter('Joined Twitter:', 'attachment://footer.png')
					.setTimestamp(user.created_at);

				if(user.location != '') {
					myEmbed.addField(':round_pushpin: ' + user.location, '\u200B', true);
				}
				if(user.url != null) {
					myEmbed.addField(':link: ' + user.url, '\u200B', true);
				}
				if(user.profile_use_background_image == true) {
					myEmbed.setImage(user.profile_banner_url);
				}
				message.channel.send({ files: [footerFile], embed: myEmbed });
			}
			else {
				message.channel.send('User "' + args[0] + '" not found.');
			}
		});
	},
};