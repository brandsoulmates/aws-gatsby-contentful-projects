'use strict';
exports.handler = (event, context, callback) => {

    // Get request and request headers
    const request = event.Records[0].cf.request;
    const headers = request.headers;
    
    const users = {
        "ayzengineer": "componentLibrary100",
    };

    // require Basic authentication
    if (typeof headers.authorization != 'undefined') {
        const authString = headers.authorization[0].value;
        const base64 = authString.substring(6);
        const combo = Buffer.from(base64, 'base64').toString('utf8').split(':');
        const username = combo[0];
        const password = combo[1];
        if(users[username] === password) {
            // Continue request processing if authentication passed
            callback(null, request);
        }
    }
    
    // otherwise, reject the request
    const body = 'Unauthorized';
    const response = {
        status: '401',
        statusDescription: 'Unauthorized',
        body: body,
        headers: {
            'www-authenticate': [{key: 'WWW-Authenticate', value:'Basic'}]
        },
    };
    callback(null, response);
};