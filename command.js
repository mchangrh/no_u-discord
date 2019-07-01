'use strict'

const commandParse = require('./commandParse.js')
const { DEFAULT_SCHEMAS, validate } = require('./validation.js')

const commandFactory = ({ name, description, type, data, extraData }, config) => {
  const command = { name, description, baseArgs: [], baseFlags: {} }

  // Use custom commands if they are defined
  if (type === 'custom') {
    command.execute = require(data)
    return command
  }

  // Generate basic commands
  let message
  if (type === 'text') {
    message = data
  } else if (type === 'image') {
    message = { file: data }
  } else if (type === 'audio') {
    message = { files: [{ attachment: data, name: extraData }] }
  } else {
    throw new Error(`Unsupported type: ${type}`)
  }

  command.execute = (messageService, args, flags, config) => {
    validate(args, DEFAULT_SCHEMAS.emptyArray)
    validate(flags, DEFAULT_SCHEMAS.emptyObject)

    return messageService.channel.send(message)
  }

  return command
}

const generateCommand = (toGenerate, commandDataByName, commandsByName, config) => {
  const { name, description, type, data } = toGenerate

  if (commandsByName[name]) {
    return
  }

  if (commandDataByName[name].checked) {
    throw new Error(`Circular alias dependency: ${name}`)
  }

  if (type === 'alias') {
    commandDataByName[name].checked = true
    const { commandName, args, flags } = commandParse(`${process.env.PREFIX}${data}`, config)

    if (!commandsByName[commandName]) {
      if (!commandDataByName[commandName]) {
        throw new Error(`Missing expected command definition: ${commandName}`)
      }
      generateCommand(commandDataByName[commandName].data, commandDataByName, commandsByName, config)
    }

    commandsByName[name] = {
      name,
      description,
      execute: commandsByName[commandName].execute,
      baseArgs: args,
      baseFlags: flags
    }
  } else {
    commandsByName[name] = commandFactory(toGenerate, config)
  }

  delete commandDataByName[name]
}

const generateCommands = (commandData, config) => {
  // Key command data by name
  const commandDataByName = commandData.reduce(
    (commandDataByName, commandDatum) => {
      const { name } = commandDatum
      commandDataByName[name] = { checked: false, data: commandDatum }
      return commandDataByName
    }, {}
  )

  // Generate commands
  const commandsByName = {}
  commandData.forEach((commandDatum) => {
    generateCommand(commandDatum, commandDataByName, commandsByName, config)
  })

  // Generate command array
  return Object.values(commandsByName)
    .map((command) => {
      // Inject base args
      return {
        ...command,
        execute: async (message, args, flags, config) => {
          return command.execute(
            message,
            command.baseArgs.concat(args),
            Object.assign({}, command.baseFlags, flags),
            config
          )
        }
      }
    })
    .sort((a, b) => {
      return a.name.localeCompare(b.name)
    })
}

module.exports = generateCommands
