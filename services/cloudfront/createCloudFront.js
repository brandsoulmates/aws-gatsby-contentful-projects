import CloudFront from 'aws-sdk/clients/CloudFront'
import config from '../../config'
const { baseServiceName, accessKeyId, secretAccessKey, region, apiVersions: { cloudFront: apiVersion }, canonicalUserId } = config;

// create a CloudFront service object
const cf = new CloudFront({
  apiVersion,
  accessKeyId,
  secretAccessKey,
  region
})


const createCloudFrontDistribution = async () => {
  var createParams = {
    DistributionConfig: { /* required */
      CallerReference: 'STRING_VALUE', /* required */
      Comment: 'STRING_VALUE', /* required */
      DefaultCacheBehavior: { /* required */
        ForwardedValues: { /* required */
          Cookies: { /* required */
            Forward: none | whitelist | all, /* required */
            WhitelistedNames: {
              Quantity: 'NUMBER_VALUE', /* required */
              Items: [
                'STRING_VALUE',
                /* more items */
              ]
            }
          },
          QueryString: true || false, /* required */
          Headers: {
            Quantity: 'NUMBER_VALUE', /* required */
            Items: [
              'STRING_VALUE',
              /* more items */
            ]
          },
          QueryStringCacheKeys: {
            Quantity: 'NUMBER_VALUE', /* required */
            Items: [
              'STRING_VALUE',
              /* more items */
            ]
          }
        },
        MinTTL: 'NUMBER_VALUE', /* required */
        TargetOriginId: 'STRING_VALUE', /* required */
        TrustedSigners: { /* required */
          Enabled: true || false, /* required */
          Quantity: 'NUMBER_VALUE', /* required */
          Items: [
            'STRING_VALUE',
            /* more items */
          ]
        },
        ViewerProtocolPolicy: allow-all | https-only | redirect-to-https, /* required */
        AllowedMethods: {
          Items: [ /* required */
            GET | HEAD | POST | PUT | PATCH | OPTIONS | DELETE,
            /* more items */
          ],
          Quantity: 'NUMBER_VALUE', /* required */
          CachedMethods: {
            Items: [ /* required */
              GET | HEAD | POST | PUT | PATCH | OPTIONS | DELETE,
              /* more items */
            ],
            Quantity: 'NUMBER_VALUE' /* required */
          }
        },
        Compress: true || false,
        DefaultTTL: 'NUMBER_VALUE',
        FieldLevelEncryptionId: 'STRING_VALUE',
        LambdaFunctionAssociations: {
          Quantity: 'NUMBER_VALUE', /* required */
          Items: [
            {
              EventType: viewer-request | viewer-response | origin-request | origin-response, /* required */
              LambdaFunctionARN: 'STRING_VALUE', /* required */
              IncludeBody: true || false
            },
            /* more items */
          ]
        },
        MaxTTL: 'NUMBER_VALUE',
        SmoothStreaming: true || false
      },
      Enabled: true || false, /* required */
      Origins: { /* required */
        Items: [ /* required */
          {
            DomainName: 'STRING_VALUE', /* required */
            Id: 'STRING_VALUE', /* required */
            CustomHeaders: {
              Quantity: 'NUMBER_VALUE', /* required */
              Items: [
                {
                  HeaderName: 'STRING_VALUE', /* required */
                  HeaderValue: 'STRING_VALUE' /* required */
                },
                /* more items */
              ]
            },
            CustomOriginConfig: {
              HTTPPort: 'NUMBER_VALUE', /* required */
              HTTPSPort: 'NUMBER_VALUE', /* required */
              OriginProtocolPolicy: http-only | match-viewer | https-only, /* required */
              OriginKeepaliveTimeout: 'NUMBER_VALUE',
              OriginReadTimeout: 'NUMBER_VALUE',
              OriginSslProtocols: {
                Items: [ /* required */
                  SSLv3 | TLSv1 | TLSv1.1 | TLSv1.2,
                  /* more items */
                ],
                Quantity: 'NUMBER_VALUE' /* required */
              }
            },
            OriginPath: 'STRING_VALUE',
            S3OriginConfig: {
              OriginAccessIdentity: 'STRING_VALUE' /* required */
            }
          },
          /* more items */
        ],
        Quantity: 'NUMBER_VALUE' /* required */
      },
      Aliases: {
        Quantity: 'NUMBER_VALUE', /* required */
        Items: [
          'STRING_VALUE',
          /* more items */
        ]
      },
      CacheBehaviors: {
        Quantity: 'NUMBER_VALUE', /* required */
        Items: [
          {
            ForwardedValues: { /* required */
              Cookies: { /* required */
                Forward: none | whitelist | all, /* required */
                WhitelistedNames: {
                  Quantity: 'NUMBER_VALUE', /* required */
                  Items: [
                    'STRING_VALUE',
                    /* more items */
                  ]
                }
              },
              QueryString: true || false, /* required */
              Headers: {
                Quantity: 'NUMBER_VALUE', /* required */
                Items: [
                  'STRING_VALUE',
                  /* more items */
                ]
              },
              QueryStringCacheKeys: {
                Quantity: 'NUMBER_VALUE', /* required */
                Items: [
                  'STRING_VALUE',
                  /* more items */
                ]
              }
            },
            MinTTL: 'NUMBER_VALUE', /* required */
            PathPattern: 'STRING_VALUE', /* required */
            TargetOriginId: 'STRING_VALUE', /* required */
            TrustedSigners: { /* required */
              Enabled: true || false, /* required */
              Quantity: 'NUMBER_VALUE', /* required */
              Items: [
                'STRING_VALUE',
                /* more items */
              ]
            },
            ViewerProtocolPolicy: allow-all | https-only | redirect-to-https, /* required */
            AllowedMethods: {
              Items: [ /* required */
                GET | HEAD | POST | PUT | PATCH | OPTIONS | DELETE,
                /* more items */
              ],
              Quantity: 'NUMBER_VALUE', /* required */
              CachedMethods: {
                Items: [ /* required */
                  GET | HEAD | POST | PUT | PATCH | OPTIONS | DELETE,
                  /* more items */
                ],
                Quantity: 'NUMBER_VALUE' /* required */
              }
            },
            Compress: true || false,
            DefaultTTL: 'NUMBER_VALUE',
            FieldLevelEncryptionId: 'STRING_VALUE',
            LambdaFunctionAssociations: {
              Quantity: 'NUMBER_VALUE', /* required */
              Items: [
                {
                  EventType: viewer-request | viewer-response | origin-request | origin-response, /* required */
                  LambdaFunctionARN: 'STRING_VALUE', /* required */
                  IncludeBody: true || false
                },
                /* more items */
              ]
            },
            MaxTTL: 'NUMBER_VALUE',
            SmoothStreaming: true || false
          },
          /* more items */
        ]
      },
      CustomErrorResponses: {
        Quantity: 'NUMBER_VALUE', /* required */
        Items: [
          {
            ErrorCode: 'NUMBER_VALUE', /* required */
            ErrorCachingMinTTL: 'NUMBER_VALUE',
            ResponseCode: 'STRING_VALUE',
            ResponsePagePath: 'STRING_VALUE'
          },
          /* more items */
        ]
      },
      DefaultRootObject: 'STRING_VALUE',
      HttpVersion: http1.1 | http2,
      IsIPV6Enabled: true || false,
      Logging: {
        Bucket: 'STRING_VALUE', /* required */
        Enabled: true || false, /* required */
        IncludeCookies: true || false, /* required */
        Prefix: 'STRING_VALUE' /* required */
      },
      OriginGroups: {
        Quantity: 'NUMBER_VALUE', /* required */
        Items: [
          {
            FailoverCriteria: { /* required */
              StatusCodes: { /* required */
                Items: [ /* required */
                  'NUMBER_VALUE',
                  /* more items */
                ],
                Quantity: 'NUMBER_VALUE' /* required */
              }
            },
            Id: 'STRING_VALUE', /* required */
            Members: { /* required */
              Items: [ /* required */
                {
                  OriginId: 'STRING_VALUE' /* required */
                },
                /* more items */
              ],
              Quantity: 'NUMBER_VALUE' /* required */
            }
          },
          /* more items */
        ]
      },
      PriceClass: PriceClass_100 | PriceClass_200 | PriceClass_All,
      Restrictions: {
        GeoRestriction: { /* required */
          Quantity: 'NUMBER_VALUE', /* required */
          RestrictionType: blacklist | whitelist | none, /* required */
          Items: [
            'STRING_VALUE',
            /* more items */
          ]
        }
      },
      ViewerCertificate: {
        ACMCertificateArn: 'STRING_VALUE',
        Certificate: 'STRING_VALUE',
        CertificateSource: cloudfront | iam | acm,
        CloudFrontDefaultCertificate: true || false,
        IAMCertificateId: 'STRING_VALUE',
        MinimumProtocolVersion: SSLv3 | TLSv1 | TLSv1_2016 | TLSv1.1_2016 | TLSv1.2_2018,
        SSLSupportMethod: sni-only | vip
      },
      WebACLId: 'STRING_VALUE'
    }
  };
  try {
    await cf.createDistribution(createParams).promise();
  } catch (e) {
    console.error(e)
  }
}

export default createCloudFrontDistribution;
