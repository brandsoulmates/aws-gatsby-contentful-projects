const AWS = require('aws-sdk')
const path = require('path')
const redirects = require('./redirects')
const S3 = new AWS.S3({
  signatureVersion: 'v4'
})

RegExp.escape = function(string) {
  return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
};

const generateRegex = (str) => new RegExp(RegExp.escape(str))


const {customRedirects, generatedRedirects} = redirects

//test with jest -- lambdas/handleRedirects

exports.handler = (event, context, callback) => {

  const getRedirect = (url, redirArr) => {
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
    for (const rule of redirArr) {
      if(typeof(rule.match) === "string")
      {
        if (url.match(generateRegex(rule.match))) {
            //string match
            redirect = rule.redirect
        }
      }else //match is regex
      {
        if (url.match(rule.match)) {
          if(url.match(rule.match).length > 1 && rule.redirect.match(/\$1/)) //if redirect has wildcard
          {
            //wildcard match
            if(url.match(/^\/docs\//))
            {
              //don't force lower case for uploaded documents
              redirect = rule.redirect.replace(/\$1/, url.match(rule.match)[1])
            }else
            {
              redirect = rule.redirect.replace(/\$1/, url.match(rule.match)[1]).toLowerCase()
            }
          }else{
            //regex match
            redirect = rule.redirect
          }
          
        }
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
  //console.log("Request: ", request.uri)
  let combinedpath

  if(request.uri.match(/page-data\//))
  {
    //don't bother redirecting or adding index.html
    //console.log("Skipping page data")
    callback(null, request)
    return
  }

  if (querystring) { 
    combinedpath = request.uri + '?' + querystring 
  } else {
    combinedpath = request.uri
  }
  
    //console.log("checking", combinedpath)
    let redirect = getRedirect(combinedpath, customRedirects)
    if (combinedpath === redirect) { //if no match, try generated redirects
      //optimization regex
      if(!request.uri.match(/^(\/events|\/professionals|\/publications-items|\/news|\/PHOffices|\/area|\/office\/)/))
      {
        //don't bother searching generated redirects if it's not one of these types
        //but do add .html if we need it
        request.uri = addHtml(request.uri)
        callback(null, request)
        return
      }

      redirect = getRedirect(combinedpath, generatedRedirects)
    }    

    if (combinedpath !== redirect) {
    // Generate HTTP redirect response to a different landing page.
      request.status = '301'
      request.statusDescription = 'Moved permanently'
      request.headers = {
        location: [{
            key: 'Location',
            value: redirect
          }],
          'cache-control': [{
            key: 'Cache-Control',
            value: 'max-age=3600'
          }]
      }
      //console.log("Redirecting to ", redirect)
      callback(null, request)
    } else {
      request.uri = addHtml(request.uri)
      // Return to CloudFront
      callback(null, request)
    }
}

function addHtml(uri){
  // for all other requests proceed to fetch the resources
    // Extract the URI from the request
      const olduri = uri
      const parsedPath = path.parse(uri)
      let newUri

      const lastCharacterInString = olduri.substr(olduri.length - 1, olduri.length)
      //console.log("Not redirecting")
      if (lastCharacterInString === '/') {
        newUri = olduri.replace(/\/$/, '\/index.html')
      } else if (parsedPath.ext === '') {
        newUri = path.join(parsedPath.dir, parsedPath.base, 'index.html')
      } else {
        newUri = uri
      }

      // console.log('New URI: ', newUri)

      // Replace the received URI with the URI that includes the index page
      return(newUri)
}
