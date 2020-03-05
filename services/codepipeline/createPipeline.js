import { CodePipeline } from "aws-sdk";

const cp = new CodePipeline({

});


const createPipeline = async () => {
  var params = {
    pipeline: { /* required */
      name: 'STRING_VALUE', /* required */
      roleArn: 'STRING_VALUE', /* required */
      stages: [ /* required */
        {
          actions: [ /* required */
            {
              actionTypeId: { /* required */
                category: Source | Build | Deploy | Test | Invoke | Approval, /* required */
                owner: AWS | ThirdParty | Custom, /* required */
                provider: 'STRING_VALUE', /* required */
                version: 'STRING_VALUE' /* required */
              },
              name: 'STRING_VALUE', /* required */
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
                  name: 'STRING_VALUE' /* required */
                },
                /* more items */
              ],
              region: 'STRING_VALUE',
              roleArn: 'STRING_VALUE',
              runOrder: 'NUMBER_VALUE'
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