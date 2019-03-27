module.exports = ({ name, description, type, data, extraData }) => {
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

	const command = { name, description };
	command.execute = (messageService, args) => {
		messageService.channel.send(message);
	};

	return command;
}