// imports
const Discord = require('discord.js');
const commandFactory = require('./command.js');
const fs = require('fs');
const yaml = require('js-yaml');
const config = require('../config.json');

// create client and collection
const client = new Discord.Client();
client.commands = new Discord.Collection();

// link commands to config
config.commands = commandData;

// generate commands from data files
const commandData = yaml.safeLoad(fs.readFileSync(config.yaml, 'utf8'))
.sort((a, b) => {
	return a.name.localeCompare(b.name);
});
commandData.forEach((commandDatum) => {
	client.commands.set(commandDatum.name, commandFactory(commandDatum));
});

client.on('ready', () => {
	console.log('Ready');
	// set presence
	client.user.setPresence({game: {name: config.name}, status: config.status})
});
// login
client.login(config.token);

const prefix = config.prefix;
client.on('message', message => {
	// check for Prefix or sent by self
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	// strip args and commands
	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	// execute command
	const command = client.commands.get(commandName);
	if (command) {
		command.execute(message, args, config);
	}
});
