import CloudFront from 'aws-sdk/clients/CloudFront'
import config from '../../config'
const {
  baseServiceName, nickName, version, accessKeyId, secretAccessKey, branch, region, apiVersions: { cloudFront: apiVersion }, canonicalUserId,
host } = config;

// create a CloudFront service object
const cf = new CloudFront({
  apiVersion,
  accessKeyId,
  secretAccessKey,
  region
})

let s3Id = `S3-${baseServiceName}`;
// coh-xqzvef1zylwc-development.s3.amazonaws.com
let s3Domain =  `${baseServiceName}.s3.amazonaws.com`
let s3OriginAccessIdentity = `access-identity-${s3Domain}`
let timeStamp = `${branch}${new Date().getTime()}`
let cloudFrontId = `${nickName}${branch}${version}`


const createCFOriginAccessIdentity = async () => {
  var createParams = {
    CloudFrontOriginAccessIdentityConfig: { /* required */
      CallerReference: timeStamp, /* required */
      Comment: `access-identity-${baseServiceName}` /* required */
    }
  };

  try {
    let res = await cf.createCloudFrontOriginAccessIdentity(createParams).promise();
    return res;
    
  } catch (e){
    console.error(e)
  }
}

/**
 * returns
 * {
  Location: 'https://cloudfront.amazonaws.com/2019-03-26/origin-access-identity/cloudfront/ECS3H0II0VFF5',
  ETag: 'E1AH86YRLJZGY4',
  CloudFrontOriginAccessIdentity: {
    Id: 'ECS3H0II0VFF5',
    S3CanonicalUserId: '56dfe13d48587dd91bc6d0f7e1b8898eedf491b88a012d98a63763b4ebfb4659b44e589dbc90308cb40f42d9451051ba',
    CloudFrontOriginAccessIdentityConfig: {
      CallerReference: 'development1582851151201',
      Comment: 'access-identity-coh-xqzvef1zylwc-development'
    }
  }
}
 */
export default createCFOriginAccessIdentity;