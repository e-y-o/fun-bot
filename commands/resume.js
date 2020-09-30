/* eslint-disable no-unused-vars */
/**
 * Resumes the music queue
 */
const { vidQueue } = require('../index.js');
module.exports = {
	name: 'resume',
	description: 'Resumes the video queue.',
	args: false,
	usage: '?resume',
	perms: ['CONNECT', 'SPEAK'],
	cooldown: 1,
	execute(message, args) {
		const serverQueue = vidQueue.get(message.guild.id);
		if(!message.member.voice.channel) {
			return message.chanel.send('You have to be in a voice channel to resume the queue.');
		}
		serverQueue.connection.dispatcher.resume();
		message.channel.send('Queue resumed.');
	},
};