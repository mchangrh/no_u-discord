'use strict'

const {
  DEFAULT_SCHEMAS,
  validate
} = require('../validation.js')

module.exports = async (message, args, flags) => {
  const argSchema = {
    type: 'string',
    required: true,
    minLength: 2,
    maxLength: 2
  }

  validate(args, argSchema)
  validate(flags, DEFAULT_SCHEMAS.emptyObject)

  // check if prompt is correct and secret phrase is correct
  if (args && args[0] === process.env.WIPE_CONFIM.replace(/ /g, '').replace(/`/g, '') && args[1] === process.env.WIPE_SECRET) {
    // start cleaning
    const startmsg = await message.channel.send('deleting your messages')
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
      startmsg.delete(process.env.AUTO_DELETE_DELAY)
      return toDelete.delete(process.env.AUTO_DELETE_DELAY)
    } catch (err) {
      console.error(err)
    }
  } else {
    // prompt to resend and delete messages
    const msg1 = await message.channel.send('this command wipes your messages. If you\'re sure you want to do this:')
    const msg2 = await message.channel.send('resend with this phrase: ' + process.env.WIPE_CONFIM + ' but without spaces')
    const msg3 = await message.channel.send('followed by the secret code from the admins')
    msg1.delete(process.enve.AUTO_DELETE_DELAY * 5)
    msg2.delete(process.enve.AUTO_DELETE_DELAY * 5)
    msg3.delete(process.enve.AUTO_DELETE_DELAY * 5)
  }
}
