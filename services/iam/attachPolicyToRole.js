import IAM from 'aws-sdk/clients/iam'
import config from '../../config'
const { baseServiceName, accessKeyId, secretAccessKey, region, apiVersions: { s3: apiVersion }, canonicalUserId } = config;

const iam = new IAM({
  accessKeyId,
  secretAccessKey,
  region
})

const attachPolicyToRole = async (roleName, policyArn) => {
  console.log('data from role', roleName)
    console.log('data from policy', policyArn)
  
  const params = {
    PolicyArn: policyArn, /* required */
    RoleName: roleName /* required */
  }
  
  try {
    let res = await iam.attachRolePolicy(params).promise();
    return res;

  } catch (e){
    console.error(e)
  }
}

export default attachPolicyToRole;
