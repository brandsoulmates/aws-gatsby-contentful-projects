/**
 * data.js
 * Data retrieval functions.
 * Requires variable from .env file
 * Also contains json building functions
 */

const contentful = require('contentful')
require('dotenv').config({
  path: `.env`,
})

// Contentful Config
const defaultLocale = 'en-US'
const space = process.env.CONTENTFUL_SPACE_ID
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN
const environment = process.env.CONTENTFUL_ENVIRONMENT
if (!space) {
  throw new Error(
    'Please specify a space for CONTENTFUL_SPACE_ID variable in your .env file'
  )
}
if (!accessToken) {
  throw new Error(
    'Please specify an access token for the CONTENTFUL_ACCESS_TOKEN variable in your .env file'
  )
}
if (!environment) {
  throw new Error(
    'Please specify an environment for the CONTENTFUL_ENVIRONMENT variable in your .env file'
  )
}
const client = contentful.createClient({
  space,
  accessToken,
  environment,
})

const getSingleEntry = async id => {
  try {
    let items = []
    let linkedEntries = []
    let linkedAssets = []
    const data = await client.getEntries({
      'sys.id': id,
      locale: '*',
    })
    items = data.items
    if (data && data.includes) {
      if (data.includes.Entry) linkedEntries = data.includes.Entry
      if (data.includes.Asset) linkedAssets = data.includes.Asset
    }
    if (items.length > 1) {
      console.log('WARNING: Found multiple entries for the same ID')
    }
    return [items, linkedEntries, linkedAssets]
  } catch (error) {
    console.log(error)
  }
}

const getAllEntries = async (contentType, limit = 30) => {
  try {
    let skip = 0
    let total = 0
    let items = []
    let linkedEntries = []
    let linkedAssets = []

    if (!contentType) {
      throw new Error(
        'Please specify a contentType by either the -c flag or the CONTENT_TYPE variable in your .env file'
      )
    }

    do {
      const newData = await client.getEntries({
        skip,
        limit,
        order: 'sys.id',
        content_type: contentType,
        locale: '*',
      })
      total = newData.total
      skip = skip + limit
      items = [...items, ...newData.items]
      if (newData && newData.includes) {
        if (newData.includes.Entry)
          linkedEntries = [...linkedEntries, ...newData.includes.Entry]
        if (newData.includes.Asset)
          linkedAssets = [...linkedAssets, ...newData.includes.Asset]
      }
    } while (items.length < total)
    return [items, linkedEntries, linkedAssets]
  } catch (error) {
    if (error.message) {
      console.log(error.message)
    } else {
      console.log(error)
    }
    return null
  }
}

exports.getEntries = async (id, contentType, limit = 10) => {
  let entries = []
  if (id) {
    console.log(`Checking ${contentType} entry ${id}...`)
    const entry = await getSingleEntry(id)
    entries = entry
  } else {
    console.log(`Checking all ${contentType} entries...`)
    const allEntries = await getAllEntries(contentType, limit)
    entries = allEntries
  }
  return entries
}

exports.attemptToGetEntries = async (argv, contentType) => {
  const entries = await this.getEntries(
    argv.id,
    contentType,
    argv['batch-size']
  )
  if (!entries) {
    const message = `Could not fetch ${contentType} data. Please reduce batch size with -b flag. Skipping check...`
    console.log(message)
    return { data: [], message }
  }

  console.log(`  Sucessfully retrieved all ${contentType} entries`)

  const [items] = entries
  if (items.length === 0) {
    const message = `Could not find any entries for ${contentType}. Skipping check...`
    console.log(message)
    return { data: [], message }
  }

  return { data: entries, message: '' }
}

exports.getJoinedEntries = async (argv, types2Check) => {
  const allEntries = await Promise.all(
    types2Check.map(async contentType => {
      const { data } = await this.attemptToGetEntries(argv, contentType)
      return data.length === 0 ? [] : data[0]
    })
  )
  return [].concat.apply([], allEntries)
}

exports.buildEntryJson = (entry, testType, data) =>
  testType === 'check'
    ? {
        id: entry.sys.id,
        name: entry.fields.name && entry.fields.name[defaultLocale],
        title: entry.fields.title && entry.fields.title[defaultLocale],
        contentType: entry.sys.contentType.sys.id,
        errors: data,
      }
    : {
        id: entry.sys.id,
        name: entry.fields.name && entry.fields.name[defaultLocale],
        title: entry.fields.title && entry.fields.title[defaultLocale],
        contentType: entry.sys.contentType.sys.id,
        locale: data,
      }

exports.buildGroupedJson = (data, group, testType, message = '') =>
  testType === 'check'
    ? {
        contentType: group,
        message,
        invalidEntries: data.length,
        data,
      }
    : {
        test: group,
        message,
        foundMatches: data.length,
        data,
      }

exports.buildOutputJson = (tests, testType) => {
  const isError = testType === 'check'
  const message = isError
    ? 'Log for flagging suspicious entries'
    : 'Log for finding entries'

  const getEntryCount = curr =>
    isError ? curr.invalidEntries : curr.foundMatches
  const reducer = (acc, curr) => acc + getEntryCount(curr)
  const totalMatches = tests.reduce(reducer, 0)

  const date = new Date()
    .toISOString()
    .replace(/T/, ' ')
    .replace(/\..+/, '')

  return isError
    ? {
        message,
        date,
        environment,
        totalInvalidEntries: totalMatches,
        tests,
      }
    : {
        message,
        date,
        environment,
        totalFoundMatches: totalMatches,
        tests,
      }
}
