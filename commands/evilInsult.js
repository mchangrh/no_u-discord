'use strict'

const request = require('request-promise-native')
const { DEFAULT_SCHEMAS, validate } = require('./../validation.js')

module.exports = async (message, args, flags, config) => {
  validate(args, DEFAULT_SCHEMAS.emptyArray)
  validate(flags, DEFAULT_SCHEMAS.emptyObject)
  
  try {
    // get insult with promise
    const { insult } = await request.get({
      url: 'https://evilinsult.com/generate_insult.php',
      headers: { 'Content-Type': 'application/json' },
      // language english
      // retrieve as json
      qs: {
        lang: 'en',
        type: 'json'
      },
      json: true
    })

    // send insult in embed
    return message.channel.send({
      embed: { description: insult }
    })
  // catch error
  } catch (err) { console.error(err) }
}
