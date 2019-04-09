'use strict';

const commandParse = require('./commandParse.js');

const generateCommands = (commandData, config) => {
	const commandsToLink = {};
	const commands = {};
	commandData.forEach((commandDatum) => {
		const { name, description, type, data } = commandDatum;

		if (type === 'alias') {
			const { commandName, args, flags } = commandParse(`${config.prefix}${data}`, config);

			// Generate command if base command exists
			if (commands[commandName]) {
				commands[name] = {
					name,
					description,
					baseArgs: commands[commandName].baseArgs.concat(args),
					baseFlags: Object.assign({}, commands[commandName].baseFlags, flags),
					execute: commands[commandName].execute,
				};

			} else {
				// Subscribe to update list
				commandsToLink[commandName] = commandsToLink[commandName] || [];
				commandsToLink[commandName].push({ name, description, baseArgs: args, baseFlags: flags });
			}

		} else {
			// Generate command
			commands[name] = commandFactory(commandDatum, config);
		}

		// Collapse command link list
		commandsToLink[name] = commandsToLink[name] || [];
		commandsToLink[name].forEach((commandToLink) => {
			// Check whether alias dependency chain is circular
			if (commandsToLink[commandToLink.name]) {
				throw new Error(`Circular alias dependency at ${name}`);
			}

			// Collapse command
			commands[commandToLink.name] = {
				name: commandToLink.name,
				description: commandToLink.description,
				baseArgs: commands[name].baseArgs.concat(commandToLink.baseArgs),
				baseFlags: Object.assign({}, commands[name].baseFlags, commandToLink.baseFlags),
				execute: commands[name].execute,
			};			
		});

		delete commandsToLink[name];
	});

	// Check for dangling aliases
	const danglingAliases = Object.keys(commandsToLink);
	if (danglingAliases.length) {
		throw new Error('Missing expected command definitions: ' + danglingAliases);
	}

	// Generate command array
	return Object.keys(commands)
	.map((commandName) => {
		const command = commands[commandName];

		// Inject base args
		return {
			...command,
			execute: async (message, args, flags, config) => {
				return command.execute(
					message,
					command.baseArgs.concat(args),
					Object.assign({}, command.baseFlags, flags),
					config,
				);
			},
		}
	})
	.sort((a, b) => {
		return a.name.localeCompare(b.name);
	});
}

const commandFactory = ({ name, description, type, data, extraData }, config) => {
	const command = { name, description, baseArgs: [], baseFlags: {} };

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

	command.execute = (messageService, args, flags, config) => {
		return messageService.channel.send(message);
	};

	return command;
}

module.exports = generateCommands;