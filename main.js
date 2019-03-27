// imports
const fs = require('fs');
const Discord = require("discord.js");

// create client and collection
const client = new Discord.Client();
client.commands = new Discord.Collection();

// import all files
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

// import configs 
const config = require("./config.json");

client.on("ready", () => {
    console.log('Ready');
});

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