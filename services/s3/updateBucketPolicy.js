import S3 from 'aws-sdk/cients/s3';
import config from '../../config';
const { baseServiceName, accessKeyId, secretAccessKey, region, apiVersions: { s3: apiVersion }, ACL, canonicalUserId } = config;
w
const s3 = new S3({
  accessKeyId,
  secretAccessKey,
  apiVersion,
  region
});


var params = {
  Bucket: baseServiceName, /* required */
  Policy: "{\"Version\": \"2012-10-17\", \"Statement\": [{ \"Sid\": \"id-1\",\"Effect\": \"Allow\",\"Principal\": {\"AWS\": \"arn:aws:iam::123456789012:root\"}, \"Action\": [ \"s3:PutObject\",\"s3:PutObjectAcl\"], \"Resource\": [\"arn:aws:s3:::acl3/*\" ] } ]}",
};

s3.putBucketPolicy(params, function(err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);           // successful response
});