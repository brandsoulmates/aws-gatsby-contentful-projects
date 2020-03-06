const AWS = require("aws-sdk");
const fs = require('fs')
const S3 = new AWS.S3({
    signatureVersion: 'v4'
})

uploadFile('redirects.json', 'redirects.json')

function uploadFile(remoteFilename, fileName) {
 var fileBuffer = fs.readFileSync(fileName);

 S3.putObject({
  ACL: 'public-read',
  Bucket: 'paulhastings-redirects',
  Key: remoteFilename,
  Body: fileBuffer,
  ContentType: "application/json"
 }, function(error, response) {
  console.log('uploaded file[' + fileName + '] to [' + remoteFilename + '] as [' + "application/json" + ']');
  console.log(arguments);
 });
}