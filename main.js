// imports
const Discord = require("discord.js");
const commandFactory = require('./command.js');
const fs = require('fs');
const yaml = require('js-yaml');

// create client and collection
const client = new Discord.Client();
client.commands = new Discord.Collection();

// generate commands from data files
yaml.safeLoad(fs.readFileSync('./data/text_commands.yml', 'utf8'))
.forEach((commandData) => {
	client.commands.set(commandData.name, commandFactory(commandData));
});

// import all command files
fs.readdirSync('./commands')
.filter((file) => {
	return file.endsWith('.js');
})
.forEach((file) => {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
});

client.on("ready", () => {
	console.log('Ready');
});

// import configs 
const config = require("./config.json");
const prefix = config.prefix;
client.on('message', message => {
	// check for Prefix
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	// strip args and commands
	const args = message.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();

	// execute command
	const command = client.commands.get(commandName);
	if (command) {
		command.execute(message, args);
	}
});

client.login(config.token);