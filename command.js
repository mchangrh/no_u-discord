module.exports = ({ name, description, type, data, extraData }) => {
	const command = { name, description };

	// Use custom commands if they are defined
	if (type === 'custom') {
		command.execute = require(data);
		return command;
	}
	
	// Generate basic commands
	let message;
	if (type === 'text') {
		message = data;
	} else if (type === 'image') {
		message = { file: data };
	} else if (type === 'audio') {
		message = { files: [{ attachment: data, name: extraData }] };
	} else {
		throw new Error(`Unsupported type: ${type}`);
	}

	command.execute = (messageService, args) => {
		messageService.channel.send(message);
	};

	return command;
}