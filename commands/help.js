module.exports = (message, args, flags, config) => {
	// Validate arguments
	if (args.length > 1) {
		throw new Error(`Expecting 0-1 arguments; received ${args.length}`);
	} else if (args.length === 1) {
		if (isNaN(args[0])) {
			throw new Error(`Expecting numeric argument; received ${args[0]}`);
		}
		
		if (parseFloat(args[0]) % 1 !== 0) {
			throw new Error(`Expecting integer argument; received ${args[0]}`);
		}
	}

	const { commands, helpCommandsPerPage, prefix } = config;
	const commandArray = commands.array();
	const totalPages = Math.floor((commandArray.length - 1) / helpCommandsPerPage) + 1;
	const argPage = args.length ? parseInt(args[0]) : 1;
	const startPage = Math.min(Math.max(argPage, 1), totalPages);
	const startIndex = (startPage - 1) * helpCommandsPerPage;

	let helpMessage = `Page ${startPage}/${totalPages}:\n`;
	for (let i = startIndex; i < Math.min(startIndex + helpCommandsPerPage, commandArray.length); ++i) {
		const { name, description } = commandArray[i];
		helpMessage += `${prefix}${name}: ${description}\n`;
	}

	return message.channel.send(helpMessage);
}