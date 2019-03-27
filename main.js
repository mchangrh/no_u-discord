// imports
const Discord = require("discord.js");
const commandFactory = require('./command.js');
const fs = require('fs');
const yaml = require('js-yaml');

// create client and collection
const client = new Discord.Client();
client.commands = new Discord.Collection();

// generate commands from data files
try {
	const textCommands = yaml.safeLoad(fs.readFileSync('./data/text_commands.yml', 'utf8'));
	textCommands.forEach((commandData) => {
		client.commands.set(commandData.name, commandFactory(commandData));
	});
} catch (err) {
	console.log(err);
}

// import all command files
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

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