//just using deployQaFromContentful.
const AWS = require('aws-sdk');
const region = 'us-east-1';
const codebuild = new AWS.CodeBuild({ region });

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
  let branchName = "dev";
  let awsCbProjectName = "paulhastings-development";
  const responseCode = 200;

  if (event.queryStringParameters && event.queryStringParameters.branchName) {
    console.log("Received branchName: " + event.queryStringParameters.branchName);
    branchName = event.queryStringParameters.branchName;
    awsCbProjectName = contentfulBranchNames[event.queryStringParameters.branchName]
  }

  function startBuild(awsCodeBuildProjectName, callback) {
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

      console.log('starting build', data);

      return callback(null, {
        statusCode: responseCode,
        body: JSON.stringify({
          "buildStatus": `Build ${data.build.buildNumber} to ${data.build.projectName}, triggered at ${data.build.startTime}`,
        })
        });
    });
  }
try {
    global.listBuildsForProject(awsCbProjectName)
    .then(({ids})=> {
      let buildIds = [ids[0], ids[1]];

      global.batchGetCodeBuilds(buildIds).then(data => {       
        if (data.builds[0].buildStatus === 'IN_PROGRESS'){
          let currentBuild = data.builds[0];
          let lastBuild = data.builds[1];
          let response = {
            statusCode: responseCode,
            body: JSON.stringify({
              "buildStatus": `Build ${currentBuild.startTime} not triggered, build ${lastBuild.startTime} in progress`,
              "lastBuild": {
                "status": lastBuild.buildStatus,
                "phase": lastBuild.buildStatus,
                "startTime": lastBuild.buildStatus,
                "endTime": lastBuild.buildStatus
              },
            "currentBuild": {
              "status": currentBuild.buildStatus,
              "phase": currentBuild.buildStatus,
              "startTime": currentBuild.buildStatus
            }
            })
          }
          return callback(null, response)
        } else {
          return startBuild(awsCbProjectName, callback)
        }
        
      })

    })

  } catch(error){
    console.log('Caught Error: ', error);
    callback(error)
  }
};