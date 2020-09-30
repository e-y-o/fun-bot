/* eslint-disable no-unused-vars */
/**
 * Skips a song to a music queue
 */
const { vidQueue } = require('../index.js');
module.exports = {
	name: 'skip',
	description: 'Skips the current song in the queue.',
	args: false,
	usage: '?skip',
	perms: ['CONNECT', 'SPEAK'],
	cooldown: 1,
	execute(message, args) {
		const serverQueue = vidQueue.get(message.guild.id);
		if(!message.member.voice.channel) {
			return message.chanel.send('You have to be in a voice channel to skip a song.');
		}
		if(!serverQueue) {
			return message.channel.send('The queue is empty.');
		}
		serverQueue.connection.dispatcher.end();
	},
};