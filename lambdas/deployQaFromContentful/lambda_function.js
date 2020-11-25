
// new deploy
const AWS = require('aws-sdk');
const region = 'us-east-1';
const cb = new AWS.CodeBuild({ region });


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

global.getCodeBuildStatus = async (projectName) => {
  try {
    const { ids } = await global.listBuildsForProject(projectName);
    let buildIds = [ids[0], ids[1]];
    const res = await global.batchGetCodeBuilds(buildIds)
    return res;

  } catch (e){
    console.error(e)
  }
}


exports.handler = async (event) => {
    let response; 
    let branch;
    let client;
    let sId;

    let startBuild = false;
    let validBranches = ['qa', 'production', 'development'];
    let validClients = ['coh', 'anetcontent'];
    let validAuthIds = ['3yvivwi0yvy3','xqzvef1zylwc']
    
    const headers = {
        "Access-Control-Allow-Origin": '*',
        "Access-Control-Allow-Methods": 'POST,GET,OPTIONS,ANY',
        "Access-Control-Allow-Credentials": true,
        "Access-Control-Allow-Headers": 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Requested-With,x-api-key',
        'Content-Type': 'application/json'
      };

    // check for valid client name
    if (event.queryStringParameters && event.queryStringParameters.client && validClients.includes(event.queryStringParameters.client)) {
        console.log("Received client: " + event.queryStringParameters.client);
        client = event.queryStringParameters.client;
    } else {
        return {
            statusCode: 200,
            body: JSON.stringify(`Please include a valid client as a query string parameter.`),
        };
    }

    // check for access token
    if (event.queryStringParameters && event.queryStringParameters.sId && validAuthIds.includes(event.queryStringParameters.sId)) {
        console.log("Received correct auth access token: " + event.queryStringParameters.sId);
      sId = event.queryStringParameters.sId;
    } else {
        return {
            statusCode: 200,
            body: JSON.stringify(`Please include a valid auth access token.`),
        };
    }
    
    // check for valid branch
    if (event.queryStringParameters && event.queryStringParameters.branch && validBranches.includes(event.queryStringParameters.branch )) {
        console.log("Received branch: " + event.queryStringParameters.branch);
        branch = event.queryStringParameters.branch;
    } else {
        return {
            statusCode: 200,
            body: JSON.stringify(`Please include a valid environment as a query string parameter (ie, branch=branchName).`),
        };
    }

    // check for type of call 
    if (event.queryStringParameters && event.queryStringParameters.startBuild ) {
      console.log("Received call: " + event.queryStringParameters.startBuild);
      startBuild = event.queryStringParameters.startBuild === 'true' ? true : false;
    } else {
        return {
            statusCode: 200,
            body: JSON.stringify(`Please include a valid start call as a query string parameter.`),
        };
    }


    const startCodeBuild = async ({client, sId, branch}) => {
      try {
        const params = {
          projectName: `${client}-${sId}-${branch}`, /* required */
          artifactsOverride: {
            type: 'CODEPIPELINE',
          }
        };

          let res = await cb.startBuild(params).promise()

          response = {
              headers,
              statusCode: 200,
              body: JSON.stringify(res),
          };
          return response;
      
      } catch (e) {
          response = {
              statusCode: 400,
              body: JSON.stringify(e),
          };
          console.error(e);
          return response;
      }
    }

    const checkCodeBuildStatus = async ({client, sId, branch}) => {
      try {
        let projectName = `${client}-${sId}-${branch}`;
        let res = await getCodeBuildStatus(projectName);
        
        response = {
            headers,
            statusCode: 200,
            body: JSON.stringify(res),
        };
      return response;
      } catch(e) {
        response = {
          statusCode: 400,
          body: JSON.stringify(e),
        };
        console.error(e);
        return response;
      }
    }
    
    if (statusOnly){
      let res = await checkCodeBuildStatus({client, sId, branch});
      return res;
    } else {
      let res = await startCodeBuild({client, sId, branch})
      return res;
    }
};
