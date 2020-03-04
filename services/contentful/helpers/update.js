const fs = require('fs')
const path = require('path')
const { readFromTempJson } = require('./result')
const keypress = require('keypress')
keypress(process.stdin)

exports.onContinue = (message, callback) => {
  console.log(message || 'Do you wish to continue? (y/n)')
  process.stdin.resume()
  process.stdin.on('keypress', function(ch, key) {
    if (key && key.name === 'y') {
      process.stdin.pause()
      process.stdin.setRawMode(false)
      callback()
    }
    if (key && (key.name === 'n' || (key.ctrl && key.name === 'c'))) {
      console.log('Exiting.')
      process.exit()
    }
  })
}

exports.updateEntries = argv => {
  const data = readFromTempJson()
  if (!data || !data.length) {
    console.log('No data could be found for updates')
    return
  }

  console.log('Updating...')

  // For each entry or single entry
  // For each locale specified
  //
  // upload and publish
  // return entries with errors

  // Log errors for each entry
  // successfulUpdates: num
  // failedUpdates: num
  // update: {
  //   contentType,
  //   fields,
  //   locales
  // }
  // writeToJson(argv, testType, tests)
}
