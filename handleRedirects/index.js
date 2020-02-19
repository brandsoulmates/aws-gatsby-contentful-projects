'use strict';

exports.handler = (event, context, callback) => {
    
    let request = event.Records[0].cf.request;
    
    if(request.uri == "/publications-items/details/?id=c28bbf6e-2334-6428-811c-ff00004cbded"){
    
    //Generate HTTP redirect response to a different landing page.
    const redirectResponse = {
        status: '301',
        statusDescription: 'Moved Permanently',
        headers: {
          'location': [{
            key: 'Location',
            value: "/insights/caveat-vendor/ftc-puts-children's-sites-on-notice-is-your-refrigerator-next",
          }],
          'cache-control': [{
            key: 'Cache-Control',
            value: "max-age=3600"
          }],
        },
    };
    callback(null, redirectResponse);
  }
  else{
      // for all other requests proceed to fetch the resources
      callback(null, request);
  }
};