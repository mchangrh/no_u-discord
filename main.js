// imports
const Discord = require('discord.js');
const commandFactory = require('./command.js');
const commandParse = require('./commandParse.js');
const fs = require('fs');
const yaml = require('js-yaml');
const config = require('../config.json');

// create client and collection
const client = new Discord.Client();
client.commands = new Discord.Collection();

// generate commands from data files
yaml.safeLoad(fs.readFileSync(config.yaml, 'utf8'))
.forEach((commandDatum) => {
	client.commands.set(commandDatum.name, commandFactory(commandDatum, config));
});

// sort commands
client.commands.array()
.sort((a, b) => {
	return a.name.localeCompare(b.name);
});

// link commands to config
config.commands = client.commands;

client.on('ready', () => {
	console.log('Ready');
	// set presence
	client.user.setPresence({game: {name: config.name}, status: config.status})
});

const prefix = config.prefix;
client.on('message', message => {
	// check if sent by self
	if (message.author.bot) return;

	try {
		// parse message
		const { commandName, args, flags } = commandParse(message.content, config);

		// check if command
		if (!commandName) return;

		// execute command
		const command = client.commands.get(commandName);
		if (command) {
			command.execute(message, args, flags, config);
		}
	} catch (err) {
		message.channel.send(err.message);
	}
});

// login
client.login(config.token);