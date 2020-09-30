/* eslint-disable no-unused-vars */
/**
 * Adds a song to a music queue
 */
const ytdl = require('ytdl-core');
const { youtube, vidQueue } = require('../index.js');
module.exports = {
	name: 'play',
	description: 'Adds a video to the queue',
	args: true,
	usage: '?play < url | query >',
	perms: ['CONNECT', 'SPEAK'],
	cooldown: 1,
	async execute(message, args) {
		if(!message.member.voice) {
			return message.channel.send('You must be connected to a channel to play the bot');
		}

		try {
			const search = args.join(' ');
			const videoPattern = /^(https?:\/\/)?(www\.)?(m\.)?(youtube\.com|youtu\.?be)\/.+$/gi;
			const playlistPattern = /^.*(list=)([^#&?]*).*/gi;
			const isUrl = videoPattern.test(args[0]);

			let url = args[0];
			let vid = null;
			const serverQueue = vidQueue.get(message.guild.id);

			if(!isUrl) {
				try {
					const searchResults = await youtube.searchVideos(search, 1);
					url = searchResults[0].url;
				}
				catch (err) {
					console.error(err);
					return message.channel.send ('No video by that title was found.');
				}
			}

			try {
				const vidData = await ytdl.getInfo(url);
				vid = {
					title: vidData.videoDetails.title,
					url: vidData.videoDetails.video_url,
					duration: vidData.videoDetails.lengthSeconds,
				};
			}
			catch (err) {
				console.error(err);
				return message.channel.send(err.message);
			}

			if(!serverQueue) {
				const queueConstruct = {
					textChannel: message.channel,
					voiceChannel: message.member.voice.channel,
					connection: null,
					vids: [],
					volume: 1,
					playing: true,
				};

				vidQueue.set(message.guild.id, queueConstruct);
				queueConstruct.vids.push(vid);

				try {
					const connection = await message.member.voice.channel.join();
					queueConstruct.connection = connection;
					this.play(message, queueConstruct.vids[0], vidQueue);
				}
				catch (err) {
					console.error(err);
					vidQueue.delete(message.guild.id);
					return message.channel.send(err.message);
				}
			}
			else {
				serverQueue.vids.push(vid);
				return message.channel.send(vid.title + ' has been added to the queue.');
			}
		}
		catch(err) {
			console.error(err);
			message.channel.send(err.message);
		}
	},

	play(message, vid) {
		const guild = message.guild;
		const serverQueue = vidQueue.get(message.guild.id);

		if(!vid) {
			serverQueue.voiceChannel.leave();
			vidQueue.delete(guild.id);
			return;
		}

		const dispatcher = serverQueue.connection
			.play(ytdl(vid.url, { quality: 'highestaudio', highWaterMark: 1 << 25 }))
			.on('finish', () => {
				serverQueue.vids.shift();
				this.play(message, serverQueue.vids[0]);
			})
			.on('error', err => console.error(err));
		dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
		serverQueue.textChannel.send('Now playing: ' + vid.title);
	},
};