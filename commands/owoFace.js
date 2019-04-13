const eyes = ['^', 'U', ';;']
const oEyes = ['o', 'O', 'Ó', 'Õ', '๏', 'ʘ', '°', '゜', '𝐨', '𝐎', '𝙊', 'σ', 'ø', 'Ø', '𝕠', '𝕆', '𝔬', '𝖔', '𝒪', '𝓞', '\u006f\u0332']
const symbolEyes = ['♥', '✧', '☆', '@', '◕', '◔', 'ᅌ', 'Ꭷ', '⓪']
const mouth = ['w', '𝓌', '𝔀', '𝕨', '𝐰', '𝙬', '𝔴', '𝖜', 'ω', 'ᗯ', 'ᵕ', '꒳', 'Ꮗ', '\u0077\u0332', '\u0077\ufe20']
const enclosure = [['(', ')'], ['(。', '。)'], ['ღ(', 'ღ)'], ['', '']]

const random = (array) => array[Math.floor(Math.random() * array.length)]

const owoBuilder = (eyes, mouth, enclosure) => {
  let randEyes = random(eyes)
  let randMouth = random(mouth)
  let randEnclosure = random(enclosure)
  return `${randEnclosure[0]}${randEyes}${randMouth}${randEyes}${randEnclosure[1]}`
}

module.exports = (message, args, flags, config) => {
  return owoBuilder([...eyes, ...oEyes, ...symbolEyes], mouth, enclosure)
}
