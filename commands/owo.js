// faces
const { owoRandom } = require('./owoFace.js')
const { DEFAULT_SCHEMAS, validate } = require('./../validation.js')

const owoify = (text, face) => {
  // text replacement
  // replace with r or l with w
  text = text.replace(/(?:r|l)/g, 'w')
    .replace(/(?:R|L)/g, 'W')
    // n[aeiou] with ny[aeiou]
    .replace(/n([aeiou])/g, 'ny$1')
    .replace(/N([aeiou])/g, 'Ny$1')
    .replace(/N([AEIOU])/g, 'Ny$1')
    // ove with uv
    .replace(/ove/g, 'uv')
    // replace ! with faces
    .replace(/!+/g, ' ' + face + ' ')
  return text
}

module.exports = async (message, args, flags, config) => {
  const argSchema = {
    type: 'array',
    required: true,
    itemSchema: { type: 'string' },
  }
  
  validate(args, argSchema)
  validate(flags, DEFAULT_SCHEMAS.emptyObject)

  let face = owoRandom()
  return message.channel.send({
    embed: {
      description: owoify(args.join(' '), face),
      title: face
    }
  })
}
