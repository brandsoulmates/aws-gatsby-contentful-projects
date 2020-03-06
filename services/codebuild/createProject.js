
import CodeBuild from 'aws-sdk/clients/CodeBuild';
import config from '../../config';
require('dotenv').config()

const {
  baseServiceName, accessKeyId, secretAccessKey, region, descriptions, branch,
  github: {
    base,
    org,
    repo
  }
} = config;

// create an cb service object
const cb = new CodeBuild({
  accessKeyId,
  secretAccessKey,
  region
})

let serviceName = baseServiceName;
let gitRepo = `${base}/${org}/${repo}.git`
let serviceRole = `${baseServiceName}-cb-role`

const constructEnvVariables = (envObj, prefixEnvKeyStr) => {
  let envVariables = Object.keys(envObj);
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
let environmentVariables = constructEnvVariables(process.env, 'GATSBY'); 
let srcVersion = false;

const createCbProject = async () => {


var paramsCodeBuild = {
  name: baseServiceName, 
  description: descriptions[branch],
  serviceRole: serviceRole, /* required */
  badgeEnabled: false,
  artifacts: { /* required */
    type: 'NO_ARTIFACTS', /* required */
  },
  environment: { /* required */
    computeType: 'BUILD_GENERAL1_SMALL', /* required */
    image: 'aws/codebuild/standard:3.0', /* required */
    type: 'LINUX_CONTAINER', /* required */
    environmentVariables,     // imagePullCredentialsType: CODEBUILD | SERVICE_ROLE,
    privilegedMode: false
  },
  source: { /* required */
    type: 'GITHUB', /* required */
    buildspec: 'buildspec.yml',
    location: gitRepo,
    reportBuildStatus: true,
    sourceIdentifier: `GitHub_${org}_Repo_${repo}`
  },
  cache: { /* */
    type: 'NO_CACHE', /* required */
    location: 'STRING_VALUE'
  },
  logsConfig: {
    cloudWatchLogs: {
      status: 'ENABLED', /* required */
    },
    s3Logs: {
      status: 'DISABLED', /* required */
    }
  }
};

// to do - set src version from repo via config
// add when doing git api int
if (srcVersion){
  paramsCodeBuild.sourceVersion = 'STRING_VALUE';
}

try {
  await cb.createProject(paramsCodeBuild).promise()

} catch(e){
  console.error(e)
}


}

createCbProject()
// export default createCbProject;