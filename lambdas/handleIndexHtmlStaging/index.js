const path = require('path');

exports.handler = (event, context, callback) => {
    // Extract the request from the CloudFront event that is sent to Lambda@Edge 
    let request = event.Records[0].cf.request;
    // Extract the URI from the request
    let olduri = request.uri;
    const parsedPath = path.parse(request.uri);
    let newUri;
    
    let lastCharacterInString = olduri.substr(olduri.length-1,olduri.length);
    
    if (lastCharacterInString === '/'){
      newUri = olduri.replace(/\/$/, '\/index.html');
    }
    else if (parsedPath.ext === '') {
        newUri = path.join(parsedPath.dir, parsedPath.base, 'index.html');
      } else {
        newUri = request.uri;
      }
    
      console.log('New URI: ', newUri);
    
      // Replace the received URI with the URI that includes the index page
      request.uri = newUri;
      
      // Return to CloudFront
      return callback(null, request);

};
