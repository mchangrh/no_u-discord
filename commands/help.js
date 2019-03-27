module.exports = (messageService, args, { prefix, commands }) => {
	const helpMessage = commands.reduce((helpMessage, { name, description }) => {
		return helpMessage.concat(`${prefix}${name}: ${description}\n`);
	}, '');

	messageService.channel.send(helpMessage);
}