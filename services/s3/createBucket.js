import S3 from 'aws-sdk/clients/s3'
import config from '../../config'
const { baseServiceName, accessKeyId, secretAccessKey, region, apiVersions: { s3: apiVersion }, canonicalUserId } = config;

// create an s3 service object
const s3 = new S3({
  accessKeyId,
  secretAccessKey,
  apiVersion,
  region
})

const createS3 = async () => {
  // create bucket params JSON for s3.createBucket
  const createParams = {
    Bucket: baseServiceName,
    // ACL,
    GrantFullControl: `id=${canonicalUserId}`, // STRING_VALUE
  };
  
  try {
    // call s3 to create the bucket
    // await s3.createBucket(createParams).promise();
    await s3.createBucket(createParams).promise();
  } catch (e){
    console.error(e)
  }
}

export default createS3;

