const { validate } = require('../validation.js')

module.exports = (message, args, flags, commands) => {
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
  const commandArray = commands.array()
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
    const { name, description } = commandArray[i]
    helpMessage += `${prefix}${name}: ${description}\n`
  }

  return message.channel.send(helpMessage)
}
