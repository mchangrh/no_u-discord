'use strict'

const { DEFAULT_SCHEMAS, validate } = require('./validation.js')
const commandParse = require('./commandParse.js')
var firebase = require('firebase')
require("firebase/firestore")

var db
var cache = {}
var promiseCache = {}
var hasAllCommands = false

const init = () => {
  firebase.initializeApp({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID
  });

  db = firebase.firestore()
}

const commandFactory = ({ name, description, type, data, extraData }, dependents = {}) => {
    const command = { name, description, baseArgs: [], baseFlags: {} }

    // Use custom commands if they are defined
    if (type === 'custom') {
      command.execute = require(data)
      return Promise.resolve(command)
    }
  
    // Generate basic commands
    let message
    switch (type) {
      case 'alias':
        const { commandName, args, flags } = commandParse(`${process.env.prefix}${data}`)
        if (dependents[commandName]) {
            return Promise.reject(new Error(`Circular alias reference detected at ${command.name}`))
        }
        
        dependents[name] = commandName
        command.baseArgs = args
        command.baseFlags = flags
        return getCommand(commandName, dependents)
          .then((baseCommand) => {
            command.execute = (messageService, args, flags) => {
              return baseCommand.execute(messageService, [...command.baseArgs, ...args], {...command.baseFlags, ...flags})
            }
            return Promise.resolve(command)
          })
      case 'audio':
        message = { files: [{ attachment: data, name: extraData }] }
        break
      case 'image':
        message = { file: data }
        break
      case 'text':
        message = data
        break
      default:
        return Promise.reject(new Error(`Unsupported type: ${type}`))
    }
  
    command.execute = (messageService, args, flags) => {
      validate(args, DEFAULT_SCHEMAS.emptyArray)
      validate(flags, DEFAULT_SCHEMAS.emptyObject)
      return messageService.channel.send(message)
    }
  
    return Promise.resolve(command)
  }

const getAllCommands = (bypassCache = false) => {
  if (!hasAllCommands || bypassCache) {
    return db.collection("commands").get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (cache[doc.id] === undefined) {
            promiseCache[doc.id] = commandFactory({ name: doc.id, ...doc.data() })
              .then((command) => {
                cache[doc.id] = command
                return command
              })
          }
        })

        return Promise.all(Object.values(promiseCache))
          .then(() => {
            hasAllCommands = true;
            return cache
          })
      })
  }

  return Promise.resolve(cache)
}

const getCommand = (commandName, dependents = {}, bypassCache = false) => {
  if (!bypassCache) {
    // check if command has been cached
    if (cache[commandName] !== undefined) {
      return Promise.resolve(cache[commandName])
    } else if (promiseCache[commandName] !== undefined) {
      return promiseCache[commandName]
    }
  } else if (hasAllCommands) {
    return Promise.resolve(null)
  }
  
  // check if command exists in database
  return db.collection("commands").doc(commandName).get()
  .then((doc) => {
    if (doc.exists && doc.id) {
      // generate command from data
      return commandFactory({ name: doc.id, ...doc.data() }, dependents)
      .then((command) => {
        cache[commandName] = command
        return cache[commandName]
      })
    } else {
      cache[commandName] = null
      return cache[commandName] 
    }
  }).catch((err) => {
    throw err
  })
}

module.exports = { init, getCommand, getAllCommands }