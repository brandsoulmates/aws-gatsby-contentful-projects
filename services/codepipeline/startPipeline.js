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