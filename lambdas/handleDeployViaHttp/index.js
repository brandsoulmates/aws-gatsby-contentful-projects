const AWS = require('aws-sdk');
const region = 'us-east-1';
const cp = new AWS.CodePipeline({ region });


exports.handler = async (event) => {
    let response; 
    let branch;
    let validBranches = ['qa', 'master', 'dev'];

    if (event.queryStringParameters && (decodeURIComponent(event.queryStringParameters.phId) === 'FLmPUtfVM4V7.#B')) {
        console.log("Received correct Id: " + event.queryStringParameters.phId);
    } else {
        return {
            statusCode: 200,
            body: JSON.stringify(`Please include a valid phId.`),
        };
    }
    
    if (event.queryStringParameters && event.queryStringParameters.branch && event.queryStringParameters.phId) {
        console.log("Received branch: " + event.queryStringParameters.branch);
        branch = event.queryStringParameters.branch;
    } else {
        return {
            statusCode: 200,
            body: JSON.stringify(`Please include a valid environment as a query string parameter (ie, branch=branchName).`),
        };
    }
    if (!validBranches.includes(branch)){
        return {
            statusCode: 200,
            body: JSON.stringify(`Please include a valid environment as a query string paramter: production, qa, or dev.`),
        };
    }
    // valid query items - production, qa, development
    // valid codebuild names - prod, qa, development
    if (branch === 'master'){
        branch = 'prod'
    }
    if (branch === 'dev'){
        branch = 'development'
    }
    let params = {
        name: `paulhastings-${branch}`
    };
    
    try {
        let res = await cp.startPipelineExecution(params).promise();
        let date = new Date().getTime()
        response = {
            statusCode: 200,
            body: JSON.stringify(`AWS: Build triggered for paulhastings-${branch} at ${date}.`),
        };
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
