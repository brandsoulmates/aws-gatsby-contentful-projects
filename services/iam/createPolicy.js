import IAM from 'aws-sdk/clients/iam'
import config from '../../config'
const { baseServiceName, accessKeyId, secretAccessKey, region, apiVersions: { s3: apiVersion }, canonicalUserId } = config;

// create an s3 service object
const iam = new IAM({
  accessKeyId,
  secretAccessKey,
  region
})
let policyName = `${baseServiceName}-service-policy`

const createPolicy = async (policy) => {
  let policyString = typeof policy !== 'string' ? JSON.stringify(policy) : policy;

  const createParams = {
    PolicyDocument: policyString, /* required */
    PolicyName: policyName, /* required */
  }
  
  try {
    let res = await iam.createPolicy(createParams).promise();
    return res;
  } catch (e){
    console.error(e)
  }
}

export default createPolicy;
