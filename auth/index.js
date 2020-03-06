const AWS = require('aws-sdk')

// Set the identity
AWS.config.credentials = new AWS.SharedIniFileCredentials({
  profile: env.identity
});