module.exports = (message, args, flags, { prefix, commands }) => {
	const helpMessage = commands.array().reduce((helpMessage, { name, description }) => {
		return helpMessage.concat(`${prefix}${name}: ${description}\n`);
	}, '');

	return message.channel.send(helpMessage);
}