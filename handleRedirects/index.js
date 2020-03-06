const AWS = require('aws-sdk')
const path = require('path')
const S3 = new AWS.S3({
  signatureVersion: 'v4'
})

const redirects = [
  {
    match: '/publications-items/details/?id=c28bbf6e-2334-6428-811c-ff00004cbded',
    redirect: "/insights/caveat-vendor/ftc-puts-children's-sites-on-notice-is-your-refrigerator-next"
  },
  {
    match: '^/PHOffices(/|)$',
    redirect: '/offices'
  },
  {
    match: '^/publications-items(/|)$',
    redirect: '/insights'
  }
]

exports.handler = (event, context, callback) => {
  RegExp.escape = function (string) {
    return string.replace(/\//g, '\\$&')
  }

  const getRedirect = (url) => {
    /*
    //get redirects from S3
    try {
      const data = await S3.getObject({ Bucket: 'paulhastings-redirects', Key: 'redirects.json' }).promise()
      let redirect = url
      let redirects = JSON.parse(data.Body)
      for (let rule of redirects) {
        if (url.match(RegExp.escape(rule.match))) {
          redirect = rule.redirect
        }
      }
      return redirect
    } catch (err) {
      console.log('Error while fetching the rules file :%j', err)
      // redirectorJson = null
      // lastUpdatedTime = currentTime
      // resolve(null)
      return url
    }
    */

    // use local redirect
    let redirect = url
    for (const rule of redirects) {
      if (url.match(RegExp.escape(rule.match))) {
        redirect = rule.redirect
      }
    }
    return redirect
  }

  // handle redirects
  // console.log("querystring: ", event.Records[0].cf.request.querystring)
  // querystring example: id=c28bbf6e-2334-6428-811c-ff00004cbded
  // request.uri example: /publications-items/details/
  const querystring = event.Records[0].cf.request.querystring

  const request = event.Records[0].cf.request
  let combinedpath
  if (querystring) { combinedpath = request.uri + '?' + querystring } else {
    combinedpath = request.uri
  }
    const redirect = getRedirect(combinedpath)
    console.log('Combined path: ', combinedpath, 'redirect: ', redirect)

    if (combinedpath !== redirect) {
    // Generate HTTP redirect response to a different landing page.
      const redirectResponse = {
        status: '301',
        statusDescription: 'Moved Permanently',
        headers: {
          location: [{
            key: 'Location',
            value: redirect
          }],
          'cache-control': [{
            key: 'Cache-Control',
            value: 'max-age=3600'
          }]
        }
      }
      callback(null, redirectResponse)
    } else {
    // for all other requests proceed to fetch the resources
    // Extract the URI from the request
      const olduri = request.uri
      const parsedPath = path.parse(request.uri)
      let newUri

      const lastCharacterInString = olduri.substr(olduri.length - 1, olduri.length)

      if (lastCharacterInString === '/') {
        newUri = olduri.replace(/\/$/, '\/index.html')
      } else if (parsedPath.ext === '') {
        newUri = path.join(parsedPath.dir, parsedPath.base, 'index.html')
      } else {
        newUri = request.uri
      }

      // console.log('New URI: ', newUri)

      // Replace the received URI with the URI that includes the index page
      request.uri = newUri

      // Return to CloudFront
      return callback(null, request)
    }
}
