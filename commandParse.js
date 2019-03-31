'use strict';

function buildArgs(argString) {
	const argStrings = argString.split(/\s+/);

	const { builtSoFar, args } = argStrings.reduce(({ quoteMark, builtSoFar, args }, arg) => {
		// Validate arg
		let validatedArg = arg;
		if (!quoteMark) {
			if (validatedArg.startsWith('\'')) {
				quoteMark = '\'';
				validatedArg = validatedArg.substr(1);
				
				if (validatedArg.endsWith('\'')) {
					quoteMark = null;
					validatedArg = validatedArg.substr(0, validatedArg.length - 1);
				}

				if (new RegExp(`(?<!\\\\)\'`).test(validatedArg)) {
					throw new Error(`Invalid token: ${arg}`);
				}
			} else if (validatedArg.startsWith('\"')) {
				quoteMark = '\"';
				validatedArg = validatedArg.substr(1);
				
				if (validatedArg.endsWith('\"')) {
					quoteMark = null;
					validatedArg = validatedArg.substr(0, validatedArg.length - 1);
				}

				if (new RegExp(`(?<!\\\\)\"`).test(validatedArg)) {
					throw new Error(`Invalid token: ${arg}`);
				}
			}
		} else {
			if (validatedArg.endsWith(quoteMark)) {
				quoteMark = null;
				validatedArg = ' ' + validatedArg.substr(0, validatedArg.length - 1);
			}

			if (new RegExp(`(?<!\\\\)${quoteMark}`).test(validatedArg)) {
				throw new Error(`Invalid token: ${arg}`);
			}
		}
		
		builtSoFar += validatedArg;
		if (!quoteMark && builtSoFar.length) {
			args.push(builtSoFar);
			builtSoFar = '';
		}

		return { quoteMark, builtSoFar, args };
	}, { quoteMark: null, builtSoFar: '', args: [] });

	if (builtSoFar.length !== 0) {
		args.push(builtSoFar);
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