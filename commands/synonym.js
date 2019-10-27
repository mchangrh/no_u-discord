'use strict'

const tiny = require('tiny-json-http')
const { DEFAULT_SCHEMAS, validate } = require('../validation.js')

module.exports = async (message, args, flags) => {
  const rootUrl = 'https://www.thesaurus.com/browse/'
  const argSchema = {
    type: 'array',
    required: true,
    itemSchema: {
        type: 'string',
        required: true,
    },
    minLength: 1,
    maxLength: Infinity
  }

  validate(args, argSchema)
  validate(flags, DEFAULT_SCHEMAS.emptyObject)

  const messageToConvert = args.join(" ")
  const wordsToConvert = messageToConvert.split(" ")
    .map((wordToConvert) => {
      return wordToConvert.toUpperCase()
    })

  let synonymPromiseMap = {}
  wordsToConvert.forEach((wordToConvert) => {
    if (synonymPromiseMap[wordToConvert] !== undefined) {
      return
    }

    synonymPromiseMap[wordToConvert] = tiny.get({
      url: `${rootUrl}${wordToConvert.toLowerCase()}`,
    })
      .then(({ body }) => {
        // Scrape synonyms
        const synonymHtmlContainer = body.match(/<ul class="css-1lc0dpe et6tpn80">.*<\/ul>/)
        const synonymHtmlList = synonymHtmlContainer[0].match(/<a(\s[\w\-]*="[\w\d\s\-\/]*")*>\w*<\/a>/g)
        return synonymHtmlList ? synonymHtmlList.map((synonymHtml) => {
            const synonym = synonymHtml.match(/>.*</)
            return synonym[0].substring(1, synonym[0].length - 1)
          }) : null
      }).catch((err) => {
        return null
      })
    }, {})

  var synonymMap = {}
  for (var i = 0; i < Object.keys(synonymPromiseMap).length; ++i) {
    const key = Object.keys(synonymPromiseMap)[i]
    synonymMap[key] = await synonymPromiseMap[key]
  }

  const newMessage = wordsToConvert
    .reduce((messageSoFar, wordToConvert) => {
      // Choose synonym at random
      const synonymList = synonymMap[wordToConvert]
      const synonym = synonymList ? synonymList[Math.floor(Math.random() * synonymList.length)] : wordToConvert.toLowerCase()
      return `${messageSoFar} ${synonym}`
    }, "")

  return message.channel.send(newMessage)
}