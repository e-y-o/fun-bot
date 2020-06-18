/* eslint-disable no-unused-vars */
module.exports = {
	name: 'resetchannel',
	aliases: ['nuke'],
	description: 'Delete and remake current text channel: `DANGEROUS`',
	args: false,
	cooldown: 10,
	execute(message, args) {
		if(message.author.member != null && !message.author.member.has('MANAGE_CHANNELS')) {
			return;
		}
		const code = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
		message.reply('To confirm deletion of `' + message.channel.name + '`, type `' + code + '` within the next 30 seconds.\n**WARNING: This action is immediate and permanent**');
		const validateCode = cd => {
			// console.log('cd: ' + cd.toString() + '\ncode: ' + code);
			if(cd.toString() == code) {
				return true;
			}
			return false;
		};
		const collector = message.channel.createMessageCollector(validateCode, { time: 30000 });
		collector.on('collect', cd => {
			message.channel.clone(this.options);
			message.channel.delete();

		});
		collector.on('end', cd => {
			message.reply('Time expired.').catch(console.error);
		});
	},
};