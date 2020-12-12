const AWS = require('aws-sdk');
const region = 'us-east-1';
const codebuild = new AWS.CodeBuild({ region });
const codepipeline = new AWS.CodePipeline({ region });


global.listBuildsForProject = async function listBuildsForProject(awsCbProjectName) {
  const response = await codebuild.listBuildsForProject({
    projectName: awsCbProjectName,
    sortOrder: 'DESCENDING'
  }).promise();

  return {
    ids: response.ids.map(id => id)
  }
}

global.batchGetCodeBuilds = async function batchGetCodeBuilds(buildIds) {
  const response = await codebuild.batchGetBuilds({
      ids: buildIds,
  }).promise();

  return {
      builds: response.builds.map(build => build),
  };
};
 
exports.handler = (event, context, callback) => {
  const contentfulBranchNames = {
    "master": "paulhastings-prod",
    "uat": "paulhastings-staging",
    "qa": "paulhastings-qa",
    "dev": "paulhastings-development"
  };
  let branchName = "master";
  let awsCbProjectName = "paulhastings-prod";
  let checkStatusOnly = false;
  const responseCode = 200;
      // "Access-Control-Allow-Credentials": "true",
    // "X-Requested-With": '*',
  const headers = {
    "Access-Control-Allow-Origin": '*',
    "Access-Control-Allow-Methods": 'POST,GET,OPTIONS,ANY',
    "Access-Control-Allow-Credentials": true,
    "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Requested-With,x-api-key',
    'Content-Type': 'application/json'
  };

  if (event.queryStringParameters && event.queryStringParameters.branchName) {
    console.log("Received branchName: " + event.queryStringParameters.branchName);
    branchName = event.queryStringParameters.branchName;
    awsCbProjectName = contentfulBranchNames[event.queryStringParameters.branchName]
  }

  if (event.queryStringParameters && event.queryStringParameters.statusOnly) {
    checkStatusOnly = true;
  }
  
  function startBuild(awsCodeBuildProjectName, previousBuild, callback) {
    var params = {
      projectName: awsCodeBuildProjectName, /* required */
      artifactsOverride: {
        type: 'CODEPIPELINE',
      }
    };
    codebuild.startBuild(params, (error, data) => {
      if (error) {
        console.log(error, error.stack);
        return callback(error);
      }

      let startTime = new Date();
                let responseBuildTriggered = {
            statusCode: responseCode,
            headers,
            body: JSON.stringify({
              "buildStatus": `TRIGGERED`,
              "currentBuild": {
                "status": "IN_PROGRESS",
                "phase": "PROVISIONING",
                "startTime": startTime,
              },
                            "previousBuild": {
                "status": "SUCCEEDED",
                "phase": "COMPLETED",
                "endTime": previousBuild.endTime
              }
            })
          }
      return callback(null, responseBuildTriggered);
    });
  }
    function startPipeline(awsCodeBuildProjectName, previousBuild, callback) {
    var params = {
      name: awsCodeBuildProjectName,
    };
    codepipeline.startPipelineExecution(params, (error, data) => {
      if (error){
        console.log(error, error.stack);
        return callback(error);

      }
      let startTime = new Date();
                let responseBuildTriggered = {
            statusCode: responseCode,
            headers,
            body: JSON.stringify({
              "buildStatus": `TRIGGERED`,
              "currentBuild": {
                "status": "IN_PROGRESS",
                "phase": "PROVISIONING",
                "startTime": startTime,
              },
                            "previousBuild": {
                "status": "SUCCEEDED",
                "phase": "COMPLETED",
                "endTime": previousBuild.endTime
              }
            })
          }
      return callback(null, responseBuildTriggered);
    })
  }
try {
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

  } catch(error){
    console.log('Caught Error: ', error);
    callback(error)
  }
};