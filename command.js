'use strict';

const commandParse = require('./commandParse.js');

module.exports = ({ name, description, type, data, extraData }, config) => {
	const command = { name, description };

	// Use custom commands if they are defined
	if (type === 'custom') {
		command.execute = require(data);
		return command;
	} else if (type === 'alias') {
		const { commandName, args, flags } = commandParse(`${config.prefix}${data}`, config);
		command.execute = (message, messageArgs, messageFlags, config) => {
			config.commands.get(commandName).execute(
				message,
				args.concat(messageArgs),
				{ ...flags, ...messageFlags },
				config,
			);
		};
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

	command.execute = (messageService, args, flags, config) => {
		return messageService.channel.send(message);
	};

	return command;
}