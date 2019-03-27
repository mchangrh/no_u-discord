const fs = require('fs');
const yaml = require('js-yaml');

module.exports = (messageService, args) => {
	const helpMessage = yaml.safeLoad(fs.readFileSync('./data/text_commands.yml', 'utf8'))
	.reduce((helpMessage, { name, description }) => {
		return helpMessage.concat(`${name}: ${description}\n`);
	}, '');

	messageService.channel.send(helpMessage);
}