// faces
const owoFace = require('./owoFace.js')
var face = owoFace()
function owoify (text) {
  // text replacement
  // replace with r or l with w
  text.replace(/(?:r|l)/g, 'w')
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
};

module.exports = async (message, args, flags, config) => {
  return message.channel.send({
    embed: {
      description: owoify(args.join(' ')),
      title: face
    }
  })
}
