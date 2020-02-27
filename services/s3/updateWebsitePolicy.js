import S3 from 'aws-sdk/clients/s3'
import config from '../../config'
const { baseServiceName, accessKeyId, secretAccessKey, region, apiVersions: { s3: apiVersion }, ACL, canonicalUserId } = config;

// create an s3 service object
const s3 = new S3({
  accessKeyId,
  secretAccessKey,
  apiVersion,
  region
})

const updateWebsitePolicy = async () => {
      // set the new website policy of the newly created bucket
  const staticHostParams = {
    Bucket: baseServiceName,
    WebsiteConfiguration: {
      IndexDocument: {
          Suffix: 'index.html',
      },
      ErrorDocument: {
          Key: '404.html',
      },
    },
  }
  
  try {
    await s3.putBucketWebsite(staticHostParams).promise();
  } catch (e) {
    console.error(e)
  }
}

export default updateWebsitePolicy;

