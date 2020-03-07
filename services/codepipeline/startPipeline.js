import CodePipeline from 'aws-sdk/clients/codepipeline';
import config from '../../config';

const {
  baseServiceName, accessKeyId, secretAccessKey, region, descriptions, branch,
  github: {
    base,
    org,
    repo
  }
} = config;

const cp = new CodePipeline({
  accessKeyId,
  secretAccessKey,
  region
});

const startPipeline = async (awsCodeBuildProjectName, previousBuild, callback) => {
  var params = {
    name: awsCodeBuildProjectName,
  };
  try {
   let res = await cp.startPipelineExecution(params).promise()
    return res;
    
  } catch (e){
    console.error(e)
  }
}


// order

global.listBuildsForProject(awsCbProjectName)
    .then(({ids})=> {
      let buildIds = [ids[0], ids[1]];

      global.batchGetCodeBuilds(buildIds).then(data => {     
      if (checkStatusOnly && data.builds[0].buildStatus !== 'IN_PROGRESS' ){
          let currentBuild = data.builds[0];
          let previousBuild = data.builds[1];
          let responseCheckStatusOnly = {
            statusCode: responseCode,
            headers,
            body: JSON.stringify({
              "buildStatus": 'COMPLETED',
              "currentBuild": {
                "status": 'No current build',
                "phase": 'No current build',
                "startTime": 'No current build',
              },
              "previousBuild": {
                "status": data.builds[0].buildStatus,
                "phase": "COMPLETED",
                "endTime": data.builds[0].endTime
              }
            })
          }
          return callback(null, responseCheckStatusOnly)
        } else if (checkStatusOnly || data.builds[0].buildStatus === 'IN_PROGRESS'){
          let currentBuild = data.builds[0];
          let previousBuild = data.builds[1];
          let responseNoBuildTriggered = {
            statusCode: responseCode,
            headers,
            body: JSON.stringify({
              "buildStatus": `IN_PROGRESS`,
              "currentBuild": {
                "status": currentBuild.buildStatus,
                "phase": currentBuild.currentPhase,
                "startTime": currentBuild.startTime
              },
              "previousBuild": {
                "status": "SUCCEEDED",
                "phase": "COMPLETED",
                "endTime": previousBuild.endTime
              }
            })
          }
          return callback(null, responseNoBuildTriggered)
        } else {
          return startPipeline(awsCbProjectName, data.builds[0], callback)
        }
        
      })

    })