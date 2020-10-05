const yargs = require('yargs')
// const { getTestResults, writeToJson } = require('./helpers/result')
const { getTestResults, writeToJson } = require('./helpers/ctype')


// Get Options
const argv = yargs
  .option('batch-size', {
    alias: 'b',
    description:
      'Set the batch size per fetch. If response size is too big, reduce this number. Default is 30',
    type: 'number',
  })
  .option('content-types', {
    alias: 'c',
    description: 'Check for specific content types.',
    type: 'array',
  })
  .option('exclude', {
    alias: 'e',
    description: 'Fields to exclude when running tests',
    type: 'array',
  })
  .option('id', {
    alias: 'i',
    description: 'Check a specific entry id',
    type: 'string',
  })
  .option('locales', {
    alias: 'L',
    description:
      'Check on certain locales. Default is "en-US, en-GB, ko, ja, fr, zh, and de"',
    type: 'array',
  })
  .option('output', {
    alias: 'o',
    description: 'Specify the name of the output file. Defaults to find.json',
    type: 'string',
  })
  .option('test', {
    alias: 't',
    description:
      'Specify a certain test. Valid arguments are: "dup-slugs, dup-ids, and all-fields-filled"',
    type: 'string',
  })
  // .option('verbose', {
  //   alias: 'v',
  //   description: 'Prints error messages to the console',
  //   type: 'boolean',
  // })
  .help()
  .alias('help', 'h').argv

const main = async () => {
  const testType = 'find'
  const testName = 'entries'
  const tests = await getTestResults(argv, testType)

  writeToJson(argv, 'entries', tests)
}

main()
