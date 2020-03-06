import S3 from 'aws-sdk/cients/s3';
import config from '../../config';
const { accessKeyId, secretAccessKey, apiVersions: { s3: apiVersion }, region } = config;

const s3 = new S3({
  accessKeyId,
  secretAccessKey,
  apiVersion,
  region
});

const listBuckets = async () => {
  try {
    await s3.listBuckets.promise();
  } catch (e){
    console.error(e)
  }
}

export default listBuckets;