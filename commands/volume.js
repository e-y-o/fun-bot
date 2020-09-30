/* eslint-disable no-unused-vars */
/**
 * Changes playback volume
 */
const { vidQueue } = require('../index.js');
module.exports = {
	name: 'volume',
	description: 'Changes playback volume',
	args: true,
	usage: '?volume < integer from 0 - 200 >',
	perms: ['CONNECT', 'SPEAK'],
	cooldown: 1,
	execute(message, args) {
		const serverQueue = vidQueue.get(message.guild.id);
		let vol = args[0];
		if(!message.member.voice.channel) {
			return message.chanel.send('You have to be in a voice channel to change playback volume.');
		}
		if(vol > 10) vol = 10;
		else if (vol <= 0) vol = 0;
		serverQueue.connection.dispatcher.setVolume(vol / 100);
		message.channel.send('Volume is now **' + vol + '%**.');
	},
};