const AWS = require('aws-sdk');
const region = 'us-east-1';
const cp = new AWS.CodePipeline({ region });
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

exports.handler = async (event) => {
    let response; 
    let branch;
    let validBranches = ['qa', 'master', 'dev'];
    let bodyParams = {}
    if(event.body)
    {
        try{
            bodyParams = JSON.parse(event.body)

        }catch(error){
            return {
                statusCode: 200,
                body: JSON.stringify(`Invalid JSON parameters.`),
            };
        }
    }else
    {
        return {
            statusCode: 200,
            body: JSON.stringify(`Invalid JSON parameters.`),
        };
    }
    
    if (decodeURIComponent(bodyParams.phId) === process.env.phidPassword) {
        //do nothing
    } else {
        return {
            statusCode: 200,
            body: JSON.stringify(`Please include a valid phId.`),
        };
    }
    
    if (bodyParams.branch && bodyParams.phId) {
        branch = bodyParams.branch;
    } else {
        return {
            statusCode: 200,
            body: JSON.stringify(`Please include a valid environment as a body parameter (ie, {"branch":"branchName"}).`),
        };
    }
    if (!validBranches.includes(branch)){
        return {
            statusCode: 200,
            body: JSON.stringify(`Please include a valid environment as a body parameter: production, qa, or dev.`),
        };
    }
    // valid query items - production, qa, development
    // valid codebuild names - prod, qa, development
    
    const contentfulBranchNames = {
    "master": "paulhastings-prod",
    "uat": "paulhastings-staging",
    "qa": "paulhastings-qa",
    "dev": "paulhastings-development"
    };

    let awsCbProjectName = "paulhastings-development";
    awsCbProjectName = contentfulBranchNames[branch]
    
    let params = {
        name: awsCbProjectName
    };
    
    try {
        let {ids} = await global.listBuildsForProject(awsCbProjectName)
        let buildIds = [ids[0], ids[1]];
        
        let buildData = await global.batchGetCodeBuilds(buildIds)
        if(buildData && buildData.builds[0] && buildData.builds[0].buildStatus)
        {
            if(buildData.builds[0].buildStatus !== 'IN_PROGRESS')
            {
                let res = await cp.startPipelineExecution(params).promise();
                let date = new Date().getTime()
                response = {
                    statusCode: 200,
                    body: JSON.stringify(`AWS: Build triggered for paulhastings-${branch} at ${date}.`),
                };
            }else
            {
                response = {
                    statusCode: 200,
                    body: JSON.stringify(`AWS: Build is already in progress.`),
                };
            }
        }
        
        return response;
    
    } catch (e) {
        response = {
            statusCode: 400,
            body: JSON.stringify('Did not trigger a deployment.'),
        };
        console.error(e);
    }
    
    return response;   
};
