var AWS = require('aws-sdk')
const S3 = new AWS.S3({
  signatureVersion: 'v4'
})

// hit MFA and use env variables
// https://aws.amazon.com/premiumsupport/knowledge-center/authenticate-mfa-cli/
// aws sts get-session-token --serial-number arn-of-the-mfa-device --token-code code-from-token
// export AWS_ACCESS_KEY_ID=example-access-key-as-in-previous-output
// export AWS_SECRET_ACCESS_KEY=example-secret-access-key-as-in-previous-output
// export AWS_SESSION_TOKEN=example-session-token-as-in-previous-output

AWS.config.credentials = new AWS.TemporaryCredentials()

// only escape slashes
RegExp.escape = function (string) {
  return string.replace(/\//g, '\\$&')
}

getRedirect = async (url) => {
  try {
    data = await S3.getObject({ Bucket: 'paulhastings-redirects', Key: 'redirects.json' }).promise()
    redirect = url
    redirects = JSON.parse(data.Body)
    for (rule of redirects) {
    	console.log(RegExp.escape(rule.match))
    	if(url.match(RegExp.escape(rule.match)))
    	{
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
}

!(async () => {
  redirect = await getRedirect('/PHOffices')
  console.log(redirect)
})()
