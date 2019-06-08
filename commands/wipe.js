'use strict'

const { DEFAULT_SCHEMAS, validate } = require('../validation.js')

module.exports = async (message, args, flags, config) => {
  validate(args, DEFAULT_SCHEMAS.emptyArray)
  validate(flags, DEFAULT_SCHEMAS.emptyObject)

  // start cleaning
  message.channel.send('deleting your messages')
  try {
    // fetch messages
    const messages = await message.channel.fetchMessages()

    // filter messages
    const botRelatedMessages = messages.filter((msg) => {
      // Delete all messages by author
      return msg.author === message.author
    })

    // delete messages
    const deletedMessages = await message.channel.bulkDelete(botRelatedMessages, true)
    const toDelete = await message.channel.send(`Deleted ${deletedMessages.size} shameful messages`)
    return toDelete.delete(config.autoDeleteDelay)
  } catch (err) {
    console.error(err)
  }
}
