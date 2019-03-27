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
    const command = args.shift().toLowerCase();
    
    // Command List
    // tests
    if (command === "ping") {
        client.commands.get('ping').execute(message, args);
    }
    // images
    else if (command === 'kiss') {
        client.commands.get('kiss').execute(message, args);
    } else if (command === 'dead') {
        client.commands.get('dead').execute(message, args);
    } else if (command === 'bread') {
        client.commands.get('bread').execute(message, args);
    } else if (command === 'thepit') {
        client.commands.get('thepit').execute(message, args);
    } 
    // copypastas
    else if (command === 'owo') {
        client.commands.get('owo').execute(message, args);
    } else if (command === 'marine') {
        client.commands.get('marine').execute(message, args)
    } else if (command === 'rawr') {
        client.commands.get('rawr').execute(message, args)
    }
});

client.login(config.token);