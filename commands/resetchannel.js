/* eslint-disable no-unused-vars */
/**
 * Deletes and remakes the channel the command is sent into, after user confirmation.
 */
const checker = require('../helpers/permcheck.js');
module.exports = {
	name: 'resetchannel',
	aliases: ['nuke'],
	description: 'Delete and remake current text channel: `DANGEROUS`',
	args: false,
	perms: ['MANAGE_CHANNELS'],
	cooldown: 30,
	execute(message, args) {
		const code = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
		message.reply('to confirm deletion of `' + message.channel.name + '`, type `' + code + '` within the next 30 seconds.\n**WARNING: This action is immediate and permanent**');
		const validateCode = cd => {
			if(cd.author == message.author && cd.toString() == code) {
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