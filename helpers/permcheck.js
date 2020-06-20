/**
 * Check if message author and bot have required permissions to execute a command.
 */
module.exports = {
	checkPerms(message, permList) {
		if(!message.member.hasPermission('ADMINISTRATOR')) {
			permList.forEach(element => {
				if(!message.member.hasPermission(element)) {
					message.reply('you do not have required permissions to execute that command.');
					return false;
				}
			});
		}

		if(!message.member.guild.me.hasPermission('ADMINISTRATOR')) {
			permList.forEach(element => {
				if(!message.member.guild.me.hasPermission(element)) {
					message.channel.send('I do not have required permissions to execute that command.');
					return false;
				}
			});
		}
		return true;
	},
};