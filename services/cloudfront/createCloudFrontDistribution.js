import CloudFront from 'aws-sdk/clients/CloudFront'
import config from '../../config'
const {
  baseServiceName, accessKeyId, secretAccessKey, branch, region, apiVersions: { cloudFront: apiVersion },
host } = config;

// create a CloudFront service object
const cf = new CloudFront({
  apiVersion,
  accessKeyId,
  secretAccessKey,
  region
})

let s3Id = `S3-${baseServiceName}`;
let s3Domain =  `${baseServiceName}.s3.amazonaws.com`
let s3OriginAccessIdentity = `access-identity0${s3Domain}`
let aliasUrl = `${branch}.${host}`


const createCloudFrontDistribution = async () => {
  var createParamsAlias = {
    DistributionConfig: { /* required */
      CallerReference: baseServiceName, /* required */
      Comment: baseServiceName, /* required */
      DefaultCacheBehavior: { /* required */
        ForwardedValues: { /* required */
          Cookies: { /* required */
            Forward: none, /* required */
          },
          QueryString: false, /* required */
        },
        MinTTL: 0, /* required */
        TargetOriginId: s3Id, /* required STRING_VALUE */
        TrustedSigners: { /* required */
          Enabled: false, /* required */
        },
        ViewerProtocolPolicy: redirect-to-https, /* required */
        AllowedMethods: {
          Items: [ /* required */
            GET,
            HEAD
            /* more items  GET | HEAD | POST | PUT | PATCH | OPTIONS | DELETE, */
          ],
          Quantity: 2, /* required */
          CachedMethods: {
            Items: [ /* required */
              GET,
              HEAD
              /* more items  GET | HEAD | POST | PUT | PATCH | OPTIONS | DELETE, */
            ],
            Quantity: 2 /* required */
          }
        },
        Compress: true,
        DefaultTTL: 86400,
        LambdaFunctionAssociations: {
          Quantity: 2, /* required NG TODO LAMBDAS*/
          Items: [
            {
              EventType: origin-request, /* required */
              LambdaFunctionARN: 'arn:aws:lambda:us-east-1:877423194256:function:handleIndex:5', /* required */
              IncludeBody: true
            },
            {
              EventType: viewer-request, /* required  viewer-request | viewer-response | origin-request | origin-response*/
              LambdaFunctionARN: 'arn:aws:lambda:us-east-1:877423194256:function:authenticateUser:2', /* required */
              IncludeBody: true
            },
          ]
        },
        MaxTTL: '31536000',
        SmoothStreaming: false
      },
      Enabled: true, /* required */
      Origins: { /* required */
        Items: [ /* required */
          {
            DomainName: s3Domain, /* required */
            Id: s3Id, /* required */
            S3OriginConfig: {
              OriginAccessIdentity: s3OriginAccessIdentity /* required */
            }
          },
        ],
        Quantity: 1 /* required */
      },
      Aliases: {
        Quantity: 1, /* required ---1 */
        Items: [
          aliasUrl,
          /* more items qa.baseSite.com*/
        ]
      },
      CacheBehaviors: {
        Quantity: 0, /* required */
      },
      CustomErrorResponses: {
        Quantity: 1, /* required */
        Items: [
          {
            ErrorCode: 403, /* required */
            ErrorCachingMinTTL: 300,
            ResponseCode: 404,
            ResponsePagePath: './404.html'
          },
        ]
      },
      DefaultRootObject: './index.html',
      HttpVersion: http2,
      IsIPV6Enabled: true,
      OriginGroups: {
        Quantity: 0, /* required */
      },
      PriceClass: PriceClass_All,
      ViewerCertificate: {
        ACMCertificateArn: 'STRING_VALUE',
        /*If the distribution uses Aliases (alternate domain names or CNAMEs) and the SSL/TLS certificate is stored in AWS Certificate Manager (ACM), provide the Amazon Resource Name (ARN) of the ACM certificate.
         CloudFront only supports ACM certificates in the US East (N. Virginia) Region (us-east-1).
         */
        CloudFrontDefaultCertificate: true || false, // true if using cloudfront domain
        MinimumProtocolVersion: TLSv1.2_2018,
        SSLSupportMethod: sni-only | vip
      }
    }
  };
  var createParams = {
    DistributionConfig: { /* required */
      CallerReference: baseServiceName, /* required */
      Comment: baseServiceName, /* required */
      DefaultCacheBehavior: { /* required */
        ForwardedValues: { /* required */
          Cookies: { /* required */
            Forward: none, /* required */
          },
          QueryString: false, /* required */
        },
        MinTTL: 0, /* required */
        TargetOriginId: s3Id, /* required STRING_VALUE */
        TrustedSigners: { /* required */
          Enabled: false, /* required */
        },
        ViewerProtocolPolicy: redirect-to-https, /* required */
        AllowedMethods: {
          Items: [ /* required */
            GET,
            HEAD
            /* more items  GET | HEAD | POST | PUT | PATCH | OPTIONS | DELETE, */
          ],
          Quantity: 2, /* required */
          CachedMethods: {
            Items: [ /* required */
              GET,
              HEAD
              /* more items  GET | HEAD | POST | PUT | PATCH | OPTIONS | DELETE, */
            ],
            Quantity: 2 /* required */
          }
        },
        Compress: true,
        DefaultTTL: 86400,
        LambdaFunctionAssociations: {
          Quantity: 2, /* required NG TODO LAMBDAS*/
          Items: [
            {
              EventType: origin-request, /* required */
              LambdaFunctionARN: 'arn:aws:lambda:us-east-1:877423194256:function:handleIndex:5', /* required */
              IncludeBody: true
            },
            {
              EventType: viewer-request, /* required  viewer-request | viewer-response | origin-request | origin-response*/
              LambdaFunctionARN: 'arn:aws:lambda:us-east-1:877423194256:function:authenticateUser:2', /* required */
              IncludeBody: true
            },
          ]
        },
        MaxTTL: '31536000',
        SmoothStreaming: false
      },
      Enabled: true, /* required */
      Origins: { /* required */
        Items: [ /* required */
          {
            DomainName: s3Domain, /* required */
            Id: s3Id, /* required */
            S3OriginConfig: {
              OriginAccessIdentity: s3OriginAccessIdentity /* required */
            }
          },
        ],
        Quantity: 1 /* required */
      },
      Aliases: {
        Quantity: 0, /* required ---1 */
      },
      CacheBehaviors: {
        Quantity: 0, /* required */
      },
      CustomErrorResponses: {
        Quantity: 1, /* required */
        Items: [
          {
            ErrorCode: 403, /* required */
            ErrorCachingMinTTL: 300,
            ResponseCode: 404,
            ResponsePagePath: './404.html'
          },
        ]
      },
      DefaultRootObject: './index.html',
      HttpVersion: http2,
      IsIPV6Enabled: true,
      OriginGroups: {
        Quantity: 0, /* required */
      },
      PriceClass: PriceClass_All,
      ViewerCertificate: {
        CloudFrontDefaultCertificate: true, // true if using cloudfront domain
      }
    }
  };
  try {
    await cf.createDistribution(createParams).promise();
  } catch (e) {
    console.error(e)
  }
}

export default createCloudFrontDistribution;
