module.exports = (commandData) => {
	const dynamicConfigs = {};
	dynamicConfigs.helpMessage = commandData.reduce((helpMessage, { name, description }) => {
		return helpMessage.concat(`${name}: ${description}\n`);
	}, '');
}