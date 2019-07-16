'use strict'

var tiny = require('tiny-json-http')
const { DEFAULT_SCHEMAS, validate } = require('./../validation.js')

const animals = {
  cat: {
    url: 'http://aws.random.cat/meow',
    content: 'file',
    loadMessage: 'retrieving cat...',
    errorHandler: (message, error) => {
      if (error.statusCode) {
        var errorcat = `https://http.cat/${error.statusCode}.jpg`
        // send error code cat
        message.channel.send({
          files: [{ attachment: errorcat }]
        })
      }
    }
  },
  dog: {
    url: 'https://random.dog/woof.json',
    content: 'url'
  },
  fox: {
    url: 'https://randomfox.ca/floof/',
    content: 'image'
  },
  shiba: {
    url: 'http://shibe.online/api/shibes',
    content: 0,
    query: {
      count: 1,
      urls: true,
      httpsUrls: false
    }
  }
}

function randAnimal () {
  const animalNames = Object.keys(animals)
  const randIndex = Math.floor(Math.random() * animalNames.length)
  return animalNames[randIndex]
}

module.exports = async (message, args, flags) => {
  const argSchema = {
    type: 'array',
    required: true,
    itemSchema: {
      type: 'enum',
      required: true,
      values: Object.keys(animals)
    },
    minLength: 0,
    maxLength: 1
  }

  validate(args, argSchema)
  validate(flags, DEFAULT_SCHEMAS.emptyObject)

  const animalName = (args && args[0]) ? args[0] : randAnimal()
  const { url, query, content, loadMessage, errorHandler } = animals[animalName]

  if (loadMessage) {
    message.channel.send(loadMessage)
  }
  return tiny.get({
    url,
    headers: { 'Content-Type': 'application/json' },
    qs: query || {}
  })
    .then((animal) => {
      message.channel.send({
        files: [{
          attachment: animal[content]
        }]
      })
    })
    .catch((error) => {
      console.error(error)
      if (errorHandler) {
        errorHandler(message, error)
      }
    })
}
