'use strict'

const { DEFAULT_SCHEMAS, validate } = require('./../validation.js')

module.exports = async (message, args, flags, config) => {
  validate(args, DEFAULT_SCHEMAS.emptyArray)
  validate(flags, DEFAULT_SCHEMAS.emptyObject)

  // start cleaning
  message.channel.send('start clean')
  try {
    // fetch messages
    const messages = await message.channel.fetchMessages()

    // filter messages
    const botRelatedMessages = messages.filter((msg) => {
      const isCommand = msg.content.startsWith('!') || msg.content.startsWith(config.prefix)
      return msg.author.bot || isCommand
    })

    // delete messages
    const deletedMessages = await message.channel.bulkDelete(botRelatedMessages, true)
    const toDelete = await message.channel.send(`Bulk deleted ${deletedMessages.size} messages`)
    return toDelete.delete(config.autoDeleteDelay)
  } catch (err) {
    console.error(err)
  }
}
