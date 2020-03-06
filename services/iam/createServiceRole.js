import IAM from 'aws-sdk/clients/iam'
import { printError } from '../../utils'
import config from '../../config'
const { baseServiceName, accessKeyId, secretAccessKey, region, apiVersions: { s3: apiVersion }, canonicalUserId } = config;

// create an s3 service object
const iam = new IAM({
  accessKeyId,
  secretAccessKey,
  region
})

let roleName = `${baseServiceName}-cb-role`

const createServiceRole = async (policy) => {
  let policyString = typeof policy !== 'string' ? JSON.stringify(policy) : policy;
  
  const createParams = {
    AssumeRolePolicyDocument: policyString, 
    Path: "/", 
    RoleName: roleName
  }
  try {
    let res = await iam.createRole(createParams).promise();
    return res;
  } catch (e){
    console.error(e)
  }
}

export default createServiceRole;
