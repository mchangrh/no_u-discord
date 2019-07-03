'use strict'

const tiny = require('tiny-json-http')
const { DEFAULT_SCHEMAS, validate } = require('./../validation.js')

module.exports = async (message, args, flags, config) => {
  validate(args, DEFAULT_SCHEMAS.emptyArray)
  validate(flags, DEFAULT_SCHEMAS.emptyObject)

  try {
    // get insult with promise
    const { insult } = await tiny.get({
      url: 'https://evilinsult.com/generate_insult.php',
      // language english
      // retrieve as json
      data: {
        lang: 'en',
        type: 'json'
      }
    })

    // send insult in embed
    return message.channel.send({
      embed: { description: insult }
    })
  // catch error
  } catch (err) { console.error(err) }
}
