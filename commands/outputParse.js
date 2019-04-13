module.exports = (message, args, flags, config) => {
  const output1 = args.reduce((output, arg) => {
    return `${output}\n\t"${arg}",`
  }, 'args: [') + '\n],'

  const output2 = Object.keys(flags).reduce((output, flag) => {
    const flagArgs = flags[flag]
    const flagOutput = flagArgs.reduce((output, arg) => {
      return `${output}\n\t\t"${arg}",`
    }, `"${flag}": [`) + '\n\t],'
    return `${output}\n\t${flagOutput}`
  }, `${output1}\nflags: {`) + '\n},'

  return message.channel.send(output2)
}
