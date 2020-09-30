/* eslint-disable no-unused-vars */
/**
 * Ends the music queue
 */
const { vidQueue } = require('../index.js');
module.exports = {
	name: 'stop',
	description: 'Stops all videos in the queue.',
	args: false,
	usage: '?stop',
	perms: ['CONNECT', 'SPEAK'],
	cooldown: 1,
	execute(message, args) {
		const serverQueue = vidQueue.get(message.guild.id);
		if(!message.member.voice.channel) {
			return message.chanel.send('You have to be in a voice channel to stop the queue.');
		}
		serverQueue.songs = [];
		serverQueue.connection.disconnect();
	},
};