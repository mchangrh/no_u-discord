// faces
var faces = ['(・`ω´・)', ';;w;;', 'owo', 'UwU', '>w<', '^w^',
  'OwO', 'Owo', 'owO', 'ÓwÓ', 'ÕwÕ',
  '@w@', 'ØwØ', 'øwø', 'uwu', '☆w☆',
  '✧w✧', '♥w♥', '゜w゜', '◕w◕', 'ᅌwᅌ',
  '◔w◔', 'ʘwʘ', '⓪w⓪', 'ʘw ︠ʘ', '(owo)',
  '𝕠𝕨𝕠', '𝕆𝕨𝕆', '𝔬𝔴𝔬', '𝖔𝖜𝖔', '𝓞𝔀𝓞',
  '𝒪𝓌𝒪', '𝐨𝐰𝐨', '𝐎𝐰𝐎', '𝘰𝘸𝘰', '𝙤𝙬𝙤',
  '𝙊𝙬𝙊', '𝚘𝚠𝚘', 'σωσ', 'OɯO', 'oʍo',
  'oᗯo', '๏w๏', 'o̲wo̲', 'ᎧᏇᎧ', 'օաօ',
  '(。O ω O。)', '(O ᵕ O)', '(O꒳O)', 'ღ(O꒳Oღ)', '♥(。ᅌ ω ᅌ。)',
  '(ʘωʘ)', '( °꒳° )', '( °ᵕ° )', '( °ω° )', '（ ゜ω 。）']
var face = faces[Math.floor(Math.random() * faces.length)]
function owoify (text) {
  // pick random face
  var face = faces[Math.floor(Math.random() * faces.length)]
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
