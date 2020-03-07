

import CodeBuild from 'aws-sdk/clients/CodeBuild';
import config from '../../config';

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

const startCbProject = async () => {
  var params = {
    projectName: baseServiceName, /* required */
    artifactsOverride: {
      type: 'CODEPIPELINE',
    }
  };

  try {
    await cb.startBuild(params).promise()
  } catch(e){
    console.error(e)
  }
}
startCbProject()
export default startCbProject()

global.listBuildsForProject = async function listBuildsForProject(awsCbProjectName) {
  const response = await codebuild.listBuildsForProject({
    projectName: awsCbProjectName,
    sortOrder: 'DESCENDING'
  }).promise();

  return {
    ids: response.ids.map(id => id)
  }
}
