import S3 from 'aws-sdk/cients/s3';
import config from '../../config';
const { baseServiceName, accessKeyId, secretAccessKey, region, apiVersions: { s3: apiVersion }, ACL, canonicalUserId } = config;

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


// {
//   "Version": "2008-10-17",
//   "Id": "PolicyForCloudFrontPrivateContent",
//   "Statement": [
//       {
//           "Sid": "0",
//           "Effect": "Allow",
//           "Principal": {
//               "AWS": "arn:aws:iam::877423194256:role/coh-xqzvef1zylwc-development-cb-role"
//           },
//           "Action": [
//               "s3:PutObject",
//               "s3:GetObject",
//               "s3:ListBucket",
//               "s3:DeleteObject"
//           ],
//           "Resource": [
//               "arn:aws:s3:::coh-xqzvef1zylwc-development",
//               "arn:aws:s3:::coh-xqzvef1zylwc-development/*"
//           ]
//       },
//       {
//           "Sid": "1",
//           "Effect": "Allow",
//           "Principal": {
//               "AWS": "arn:aws:iam::877423194256:role/service-role/coh-xqzvef1zylwc-development-cp-role"
//           },
//           "Action": [
//               "s3:PutObject",
//               "s3:GetObject",
//               "s3:ListBucket",
//               "s3:DeleteObject"
//           ],
//           "Resource": [
//               "arn:aws:s3:::coh-xqzvef1zylwc-development",
//               "arn:aws:s3:::coh-xqzvef1zylwc-development/*"
//           ]
//       },
//       {
//           "Sid": "2",
//           "Effect": "Allow",
//           "Principal": {
//               "AWS": "arn:aws:iam::cloudfront:user/CloudFront Origin Access Identity E1VY37LQPZDTS2"
//           },
//           "Action": "s3:GetObject",
//           "Resource": "arn:aws:s3:::coh-xqzvef1zylwc-development/*"
//       }
//   ]
// }