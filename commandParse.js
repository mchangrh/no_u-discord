'use strict';

function buildArgs(originalArgString) {
	let argString = originalArgString;
	const args = [];

	function getBoundArg(boundMarker) {
		if (argString.startsWith(boundMarker)) {
			let arg = argString.substr(boundMarker.length);
			let splitIndex = arg.search(new RegExp(boundMarker));
			if (splitIndex === -1) splitIndex = arg.length;
			args.push(arg.substr(0, splitIndex));
			argString = arg.substr(splitIndex + boundMarker.length);
			if (argString.length && argString.search(/\s/)) {
				throw new Error(`Illegal argument format: ${originalArgString}`);
			}
			argString = argString.trim();
		}
	}

	while (argString.length) {
		if (argString.startsWith('\'')) {
			getBoundArg('\'');
		} else if (argString.startsWith('\"')) {
			getBoundArg('\"');
		} else {
			let splitIndex = argString.search(/\s/);
			if (splitIndex === -1) splitIndex = argString.length;
			args.push(argString.substr(0, splitIndex));
			argString = argString.substr(splitIndex + 1).trim();
		}
	}

	return args;
}

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

	// Build command
	let commandSplitIndex = commandWithArgs.search(/\s/);
	commandSplitIndex = (commandSplitIndex === -1) ? commandWithArgs.length : commandSplitIndex;
	output.commandName = commandWithArgs.substr(prefix.length, commandSplitIndex - prefix.length);
	output.args = buildArgs(commandWithArgs.substr(commandSplitIndex + 1));

	// Build flags
	output.flags = flagsWithArgs ? flagsWithArgs.reduce((flags, flagWithArgs) => {
		let flagSplitIndex = flagWithArgs.search(/\s/);
		flagSplitIndex = (flagSplitIndex === -1) ? flagWithArgs.length : flagSplitIndex;
		const flag = flagWithArgs.substr(0, flagSplitIndex);
		flags[flag] = buildArgs(flagWithArgs.substr(flagSplitIndex + 1));
		return flags;
	}, {}) : {};

	return output;
}