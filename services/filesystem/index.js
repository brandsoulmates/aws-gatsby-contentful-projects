import fs from 'fs';
import envfile from 'envfile';
import path from 'path';
require('dotenv').config()


export const updateEnvVariable = ({variableKey, variableValue}) => {
  const sourcePath = path.resolve(__dirname, '../../.env');
  let parsedFile = envfile.parseFileSync(sourcePath);
  
  parsedFile[variableKey] = variableValue
  fs.writeFileSync('./.env', envfile.stringifySync(parsedFile)) 
  console.log(envfile.stringifySync(parsedFile))
}

export const constructEnvVariables = ({prefixEnvKeyStr}) => {
  let envVariables = Object.keys(process.env);
  let filterByGatsby = (arr) => arr.filter(item => item.includes(prefixEnvKeyStr));
  let pertinentVariables = filterByGatsby(envVariables);
  const awsOkayVariables = pertinentVariables.map(variableKey => ({
    name: variableKey, /* required */
    value: process.env[variableKey], /* required */
    type: 'PLAINTEXT'
  }))
  for (let i = 0; i < awsOkayVariables.length; i++){
    if (awsOkayVariables[i]['GATSBY_AWS_CLOUDFRONT_DISTRIBUTION']){
      // need the id passed in here
      awsOkayVariables[i] = {
        GATSBY_AWS_CLOUDFRONT_DISTRIBUTION: baseServiceName
      }
    }
    if (awsOkayVariables[i]['GATSBY_AWS_TARGET_BUCKET_NAME']){
      awsOkayVariables[i] = {
        GATSBY_AWS_TARGET_BUCKET_NAME: baseServiceName
      }
    } else {
      continue;
    }
  }
  return awsOkayVariables;
}