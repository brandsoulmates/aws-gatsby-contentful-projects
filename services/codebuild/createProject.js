
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
    sourceIdentifier: `github_${org}_repo`
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
/**
 * version: 0.2
phases:
  install:
    runtime-versions:
      nodejs: 12
    commands:
      - echo prepare env and check latest version of node.
      - apt-get update && apt-get install -y make apt-transport-https
      - curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
      - echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
      - apt-get install -y yarn
      - yarn global add lerna gatsby-cli
  pre_build:
    commands:
      - echo prebuild site using lerna
      - lerna bootstrap
  build:
    commands:
      - echo build site using yarn
      - yarn build:coh
  post_build:
    commands:
      - echo syncing to s3 and cloudfront
      - yarn deploy:coh
      - echo after sync to S3
artifacts:
  base-directory: packages/coh/public
  files:
discard-paths: yes

add this build spec inline
update the api keys env default
 */
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