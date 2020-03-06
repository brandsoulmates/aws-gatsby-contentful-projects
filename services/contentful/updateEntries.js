const yargs = require('yargs')
const { onContinue, updateEntries } = require('./helpers/update')
const { attemptToGetEntries } = require('./helpers/data')
const { writeToTempJson } = require('./helpers/result')

// Get Options
const argv = yargs
  .option('batch-size', {
    alias: 'b',
    description:
      'Set the batch size per fetch. If response size is too big, reduce this number. Default is 30',
    type: 'number',
  })
  .option('content-type', {
    alias: 'c',
    description: '[REQUIRED] Specify the content type to update',
    type: 'string',
    demandOption: true,
  })
  .option('force-update', {
    alias: 'F',
    description: 'Update without confirmation',
    type: 'boolean',
  })
  .option('id', {
    alias: 'i',
    description: 'Update content a specific entry id',
    type: 'string',
  })
  .option('locales', {
    alias: 'L',
    description: 'Run update on certain locales. Default is "en-US"',
    type: 'array',
  })
  .option('output', {
    alias: 'o',
    description: 'Specify the name of the output file. Defaults to find.json',
    type: 'string',
  })
  .option('preview', {
    description: 'Check the structure of the json file to update',
    type: 'boolean',
  })
  // .option('fields', {
  //   alias: 'f',
  //   description:
  //     'Specify fields to update.',
  //   type: 'string',
  // })
  // .option('verbose', {
  //   alias: 'v',
  //   description: 'Prints error messages to the console',
  //   type: 'boolean',
  // })
  // .option('path', {
  //   alias: 'p',
  //   describe: '[REQUIRED] Provide a path to file',
  //   // demandOption: true,
  // })
  .help()
  .alias('help', 'h').argv

const main = async () => {
  const testType = 'update'

  // Get all the data for content type specified
  const fields = []

  // if (!fields.length) {
  //   console.log('No fields were found to perform updates. Exiting.')
  //   return
  // }

  const contentType = argv['content-type']
  const locales = argv.locales || ['en-US']
  const { data } = await attemptToGetEntries(argv, contentType)

  if (!data.length) {
    console.log('No entries were found to perform updates. Exiting.')
    return
  }
  const [entries] = data

  if (argv.preview) {
    await writeToTempJson(
      'preview',
      entries.map(e => e.fields.title)
    )
    console.log('Refer to the file above to examine json structure')
    return
  }

  // Write changes to json file
  console.log(
    `\nAttempting to update the field(s): ${fields.join(', ')} for ${
      entries.length
    } ${contentType} entries on the locale(s): ${locales.join(', ')}`
  )
  await writeToTempJson(
    'update',
    entries.map(e => e.fields.title)
  )

  const message =
    'Please make any modifications to this file before pressing (y) to continue. Or press (n) to exit the script now.'

  if (argv['force-update']) {
    updateEntries(argv)
  } else {
    process.stdin.setRawMode(true)
    onContinue(message, () => updateEntries(argv))
  }
}

main()
