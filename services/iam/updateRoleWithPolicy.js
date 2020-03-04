
import IAM from 'aws-sdk/clients/iam'
import config from '../../config'
const { baseServiceName, accessKeyId, secretAccessKey, region, apiVersions: { s3: apiVersion }, canonicalUserId } = config;

const iam = new IAM({
  accessKeyId,
  secretAccessKey,
  region
})

/* The following command adds a permissions policy 
to the role specified. */

 let policyName = `${baseServiceName}-service-policy`


const updateRoleWithPolicy = async (policyDocument, roleName) => {
  let policyString = typeof policyDocument !== 'string' ? JSON.stringify(policyDocument) : policyDocument;
  
  const putParams = {
    PolicyDocument: policyString , 
    PolicyName: policyName, 
    RoleName: roleName
  }
  
  try {
    await iam.putRolePolicy(putParams).promise();
  } catch (e){
    console.error(e)
  }
}

export default updateRoleWithPolicy;

