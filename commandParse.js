'use strict';

module.exports = (rawMessage, config) => {
	const { prefix, flagPrefix } = config;
	const output = {
		commandName: null,
		flags: {},
		args: [],
	};

	// Check whether the message is a command
	if (!rawMessage.startsWith(prefix)) {
		return output;
	}

	// Check for valid command
	const [commandWithArgs, ...flagsWithArgs] = rawMessage.split(new RegExp(`\\s+${flagPrefix}`));
	if (commandWithArgs.length <= prefix.length) {
		throw new Error(`Invalid command: ${rawMessage}`);
	}

	const [command, ...args] = commandWithArgs.split(/\s+/);
	output.commandName = command.substr(prefix.length).toLowerCase();
	output.args = args || [];
	output.flags = flagsWithArgs ? flagsWithArgs.reduce((flags, flagWithArgs) => {
		const [flag, ...flagArgs] = flagWithArgs.split(/\s+/);
		flags[flag] = flagArgs || [];
		return flags;
	}, {}) : {};

	return output;
}