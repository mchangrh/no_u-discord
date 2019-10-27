// imports
require('dotenv').config()
require('enve')
const Discord = require('discord.js')
const commandParse = require('./commandParse.js')
const dbLayer = require('./dbLayer.js')

dbLayer.init()

// create client and collection
const client = new Discord.Client()
client.commandCache = new Discord.Collection()

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

    // get command
    dbLayer.getCommand(commandName)
      .then((command) => {
        if (command) {
          return command.execute(message, args, flags, client.commands)
        }
      }).catch((err) => {
        handle(err)
      })
  } catch (err) {
    handle(err)
  }
})

// login
client.login(process.env.TOKEN)
