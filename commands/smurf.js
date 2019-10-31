'use strict'
// import jssha
const jsSHA = require("jssha")

const {
  DEFAULT_SCHEMAS,
  validate
} = require('./../validation.js')

// dec2hex
function dec2hex(s) {
  return (s < 15.5 ? "0" : "") + Math.round(s).toString(16)
}
// hex2dec
function hex2dec(s) {
  return parseInt(s, 16)
}
// leftpad
function leftpad(str, len, pad) {
  if (len + 1 >= str.length) {
    str = Array(len + 1 - str.length).join(pad) + str
  }
  return str
}

function getOtp(key, now = new Date().getTime()) {
  const epoch = Math.round(now / 1000.0)
  const time = leftpad(dec2hex(Math.floor(epoch / 30)), 16, "0")
  // HMAC object
  var shaObj = new jsSHA("SHA-1", "HEX")
  shaObj.setHMACKey(key, "HEX")
  shaObj.update(time)
  const hmac = shaObj.getHMAC("HEX")
  // format
  const offset = hex2dec(hmac.substring(hmac.length - 1))
  var otp = (hex2dec(hmac.substr(offset * 2, 8)) & hex2dec("7fffffff")) + ""
  // pad and cutoff
  if (otp.length > 6) {
    otp = otp.substr(otp.length - 6, 6)
  } else {
    otp = leftpad(otp, 6, "0")
  }
  return otp
}

module.exports = async (message, args, flags) => {
  validate(args, DEFAULT_SCHEMAS.emptyArray)
  validate(flags, DEFAULT_SCHEMAS.emptyObject)

  try {
    // send insult in embed
    return message.channel.send({
      embed: {
        description: 'Smurf',
        fields: [{
            name: 'Email',
            value: process.env.SMURF_EMAIL
          },
          {
            name: 'Password',
            value: process.env.SMURF_PWD
          },
          {
            name: 'OTP Code',
            value: getOtp(process.env.SMURF_TOTP)
          }
        ]
      }
    })
    // catch error
  } catch (err) {
    console.error(err)
  }
}