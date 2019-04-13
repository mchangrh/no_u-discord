const eyes = ['^', 'U', ';;', '♥', '✧', '☆', '@', '◕', '◔', 'ᅌ', 'Ꭷ', '⓪', 'o', 'O', 'Ó', 'Õ', '๏', 'ʘ', '°', '゜', '𝐨', '𝐎', '𝙊', 'σ', 'ø', 'Ø', '𝕠', '𝕆', '𝔬', '𝖔', '𝒪', '𝓞', '\u006f\u0332']
const mouth = ['w', '𝓌', '𝔀', '𝕨', '𝐰', '𝙬', '𝔴', '𝖜', 'ω', 'ᗯ', 'ᵕ', '꒳', 'Ꮗ', '\u0077\u0332', '\u0077\ufe20']
const enclosure = [['(', ')'], ['(。', '。)'], ['ღ(', 'ღ)'], ['', '']]

function rand (array) { return array[Math.floor(Math.random() * array.length)] }

const randEye = rand(eyes)
const randMouth = rand(mouth)
const randEnclosure = rand(enclosure)

var owoFactory = (eye, mouth, enclosure) => {
  return `${enclosure[0]}${eye}${mouth}${eye}${enclosure[1]}`
}

module.exports = () => { return owoFactory(randEye, randMouth, randEnclosure) }
