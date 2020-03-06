import spaceImport from 'contentful-import';

const spaceImport = require('contentful-import') // get stuff from contentful
const exportFile = require('../contentful/export.json') // use our premade template
const inquirer = require('inquirer') // ask questions via cli
const chalk = require('chalk') // make it pretty
const path = require('path') // access correct file path
const { writeFileSync } = require('fs') // make file-system apis simple

console.log(`
  Welcome to ${chalk.cyan('Paul Hastings')}!
  First, please provide your Contentful Space ID
  and three corresponding API access tokens.

  The API tokens are usually located under:

  ${chalk.yellow(
    `app.contentful.com ${chalk.red('->')} Settings ${chalk.red('->')} API keys`
  )}
  Ready? Let's get started. 🎉
`)

const questions = [
  {
    name: 'spaceId',
    message: 'Your Space ID',
    validate: input =>
      /^[a-z0-9]{12}$/.test(input) ||
      'Space ID must be 12 lowercase characters',
  },
  {
    name: 'accessToken',
    message: 'Your Content Delivery API access token',
  },
  {
    name: 'previewToken',
    message: 'Your Content Preview API access token',
  },
  {
    name: 'managementToken',
    message: 'Your Content Management API access token',
  },
]

inquirer
  .prompt(questions)
  .then(({ spaceId, accessToken, previewToken, managementToken }) => {
    console.log('Writing config file...')
    const configFilePath = path.resolve(__dirname, '..', '.contentful.json')
    writeFileSync(
      configFilePath,
      JSON.stringify(
        {
          development: {
            host: 'preview.contentful.com',
            spaceId,
            accessToken: previewToken,
          },
          production: {
            spaceId,
            accessToken,
          },
        },
        null,
        2
      )
    )
    console.log(
      `Config file ${chalk.green(configFilePath)} successfully written.`
    )
    return { spaceId, managementToken }
  })
  .then(({ spaceId, managementToken }) =>
    spaceImport({ spaceId, managementToken, content: exportFile })
  )
  .then((_, error) => {
    console.log(
      `
      Wahoo, ${chalk.green('success')}!
      Run ${chalk.yellow('npm run start')}
      to get cracking. 😎
      `
    )
  })
  .catch(error => console.error(error))
