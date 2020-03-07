const { createClient } = require('contentful')
const contentful = require('contentful-management')
import config from '../../config';

const {
  nickName,
  cms: {
    contentful: {
      managementAccessTokenSecret,
      deliveryAccessToken,
      previewAccessToken,
      spaceId,
      environment,
      host,
      previewMode
    }
  }
} = config;

let deliveryClient = null
let previewClient = null
let managementClient = null

/**
 * Initialize the contentful Client service object
 * @param options {spaceId: string, deliveryToken: string, previewToken: string}
 *
 * @returns {undefined}
 */
module.exports.initContentfulClients = (options) => {
  const applicationName = nickName

  deliveryClient = createClient({
    application: applicationName,
    space: spaceId,
    accessToken: deliveryAccessToken,
    host: 'cdn.contentful.com',
    removeUnresolved: true
  })

  managementClient = contentful.createClient({
    accessToken: managementAccessTokenSecret,
    space: spaceId,
    application: applicationName,

  })

  previewClient = createClient({
    application: applicationName,
    space: spaceId,
    accessToken: previewAccessToken,
    host: 'preview.contentful.com' ,
    removeUnresolved: true
  })
}

/**
 * Get the Space the app is connected to. Used for the settings form and to get all available locales
 * @param api - string - the api to use, cda, cma, or cap. Default: 'cda'
 * @returns {undefined}
 */
module.exports.getSpace = throwOnEmptyResult('Space', (api = 'cda') => {
  return getClient(api).getSpace()
})

/**
 * Get the environment locales
 * @param api - string - the api to use, cda or cap. Default: 'cda'
 * @returns {undefined}
 */
module.exports.getLocales = throwOnEmptyResult('Environment', (api = 'cda') => {
  return getClient(api).getLocales()
    .then((response) => response.items)
})

/**
 * Gets an entry. Used to detect the `Draft` or `Pending Changes` state
 * @param entryId - string - the entry id
 * @param api - string - the api to use fetching the entry
 *
 * @returns {Object}
 */

module.exports.getEntry = throwOnEmptyResult('Entry', (entryId, contentType, api = 'cda') => {
  return getClient(api).getEntries({content_type: contentType, 'sys.id': entryId})
    .then((response) => response.items[0])
})


// Utility function
function getClient (api = 'cda') {
  return api === 'cda' ? deliveryClient : managementClient
}

/**
 * Utility function for wrapping regular API calls.
 * This is done for easily catching 404 errors.
 * @param  {string}   context The type of result the function is looking for
 * @param  {Function} fn      The function to wrap
 * @return {Object}           The result of `fn`, if not empty
 * @throws {Error}    When `fn` returns an empty result
 */
function throwOnEmptyResult (context, fn) {
  return function (...params) {
    return fn(...params)
      .then((data) => {
        if (!data) {
          var err = new Error(`${context} Not Found`)
          err.status = 404
          throw err
        }
        return data
      })
  }
}
