// imports
require('dotenv').config()
require('enve')
const Discord = require('discord.js')
const generateCommands = require('./command.js')
const commandParse = require('./commandParse.js')
const fs = require('fs')
const yaml = require('js-yaml')

// create client and collection
const client = new Discord.Client()
client.commands = new Discord.Collection()

// generate commands from data files
generateCommands(yaml.safeLoad(fs.readFileSync(process.env.YAML, 'utf8')))
  .forEach((command) => {
    client.commands.set(command.name, command)
  })

client.on('ready', () => {
  console.log('Ready')
  // set presence
  client.user.setPresence({ game: { name: process.env.NAME }, status: process.env.STATUS })
})

client.on('message', message => {
  // check if sent by self
  if (message.author.bot) return

  function handle (error) {
    message.channel.send(error.message)
  }

  try {
    // parse message
    const { commandName, args, flags } = commandParse(message.content)

    // check if command
    if (!commandName) return

    // execute command
    const command = client.commands.get(commandName)
    if (command) {
      command.execute(message, args, flags, client.commands)
        .catch((err) => {
          handle(err)
        })
    }
  } catch (err) {
    handle(err)
  }
})

// login
client.login(process.env.TOKEN)
