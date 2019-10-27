const { validate } = require('../validation.js')
const dbLayer = require('../dbLayer.js')

module.exports = async (message, args, flags) => {
  const argSchema = {
    type: 'array',
    required: true,
    itemSchema: {
      type: 'integer',
      required: false
    },
    minLength: 0,
    maxLength: 1
  }

  const flagSchema = {
    type: 'object',
    required: true,
    keys: {
      listAll: {
        type: 'array',
        required: false,
        itemSchema: { type: 'any' },
        minLength: 0,
        maxLength: 0
      }
    }
  }

  // Validate arguments
  validate(args, argSchema)
  validate(flags, flagSchema)

  const helpCommandsPerPage = process.enve.HELP_COMMANDS_PER_PAGE
  const prefix = process.env.PREFIX
  const allCommands = await dbLayer.getAllCommands()
  const commandArray = Object.values(allCommands)
    .filter((command) => {
      return command
    }).sort((a, b) => {
      if (a.name.toUpperCase() < b.name.toUpperCase()) {
        return -1
      } else if (a.name.toUpperCase() > b.name.toUpperCase()) {
        return 1
      } else {
        return 0
      }
    })
  const totalPages = Math.floor((commandArray.length - 1) / helpCommandsPerPage) + 1
  const argPage = args.length ? parseInt(args[0]) : 1
  let startIndex
  let endIndex
  let helpMessage

  if (flags['listAll']) {
    startIndex = 0
    endIndex = commandArray.length
    helpMessage = ''
  } else {
    const startPage = Math.min(Math.max(argPage, 1), totalPages)
    startIndex = (startPage - 1) * helpCommandsPerPage
    endIndex = Math.min(startIndex + helpCommandsPerPage, commandArray.length)
    helpMessage = `Page ${startPage}/${totalPages}:\n`
  }

  for (let i = startIndex; i < endIndex; ++i) {
    if (commandArray[i]) {
      const { name, description } = commandArray[i]
      helpMessage += `${prefix}${name}: ${description}\n`
    }
  }

  return message.channel.send(helpMessage)
}
