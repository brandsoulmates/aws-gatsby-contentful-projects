import CodePipeline from 'aws-sdk/clients/codepipeline';
import config from '../../config';

const {
  baseServiceName, accessKeyId, secretAccessKey, region, descriptions, branch,
  github: {
    base,
    org,
    repo
  }
} = config;

const cp = new CodePipeline({
  accessKeyId,
  secretAccessKey,
  region
});


const createPipeline = async () => {
  var params = {
    pipeline: { /* required */
      name: baseServiceName, /* required */
      roleArn: 'STRING_VALUE', /* required */
      stages: [ /* required */
        {
          actions: [ /* required */
            {
              actionTypeId: { /* required */
                category: 'Source', /* required */
                owner: 'AWS' | 'ThirdParty', /* required */
                provider: 'GitHub', /* required */
                version: '1.1.1' /* required */
              },
              name: 'GitHub', /* required */
              configuration: {
                '<ActionConfigurationKey>': 'STRING_VALUE',
                /* '<ActionConfigurationKey>': ... */
              },
              inputArtifacts: [
                {
                  name: 'STRING_VALUE' /* required */
                },
                /* more items */
              ],
              namespace: 'STRING_VALUE',
              outputArtifacts: [
                {
                  name: 'SourceArtifact' /* required */
                },
                /* more items */
              ],
              region: region,
              roleArn: 'STRING_VALUE'
            },
            /* more items */
          ],
          name: 'STRING_VALUE', /* required */
          blockers: [
            {
              name: 'STRING_VALUE', /* required */
              type: Schedule /* required */
            },
            /* more items */
          ]
        },
        {
          actions: [ /* required */
            {
              actionTypeId: { /* required */
                category: 'Build', /* required */
                owner: 'AWS', /* required */
                provider: 'AWS CodeBuild', /* required */
                version: 'STRING_VALUE' /* required */
              },
              name: 'STRING_VALUE', /* required */
              configuration: {
                '<ActionConfigurationKey>': 'STRING_VALUE',
                /* '<ActionConfigurationKey>': ... */
              },
              inputArtifacts: [
                {
                  name: 'SourceArtifact' /* required */
                },
                /* more items */
              ],
              namespace: baseServiceName,
              outputArtifacts: [
                {
                  name: 'BuildArtifact' /* required */
                },
                /* more items */
              ],
              region: region,
              roleArn: 'STRING_VALUE',
              runOrder: 'NUMBER_VALUE'
            }
          ],
          name: 'STRING_VALUE', /* required */
          blockers: [
            {
              name: 'STRING_VALUE', /* required */
              type: Schedule /* required */
            },
            /* more items */
          ]
        }
        /* more items */
      ],
      artifactStore: {
        location: 'STRING_VALUE', /* required */
        type: S3, /* required */
        encryptionKey: {
          id: 'STRING_VALUE', /* required */
          type: KMS /* required */
        }
      },
      artifactStores: {
        '<AWSRegionName>': {
          location: 'STRING_VALUE', /* required */
          type: S3, /* required */
          encryptionKey: {
            id: 'STRING_VALUE', /* required */
            type: KMS /* required */
          }
        },
        /* '<AWSRegionName>': ... */
      },
      version: 'NUMBER_VALUE'
    },
    tags: [
      {
        key: 'STRING_VALUE', /* required */
        value: 'STRING_VALUE' /* required */
      },
      /* more items */
    ]
  };
  try {
    cp.createPipeline(params, function(err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    });
  } catch (e){
    console.error(e)
  }
}
export default createPipeline;