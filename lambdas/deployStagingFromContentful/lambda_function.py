import boto3, json

def lambda_handler(event, context):
    
    client = boto3.client('codebuild')
    
    response = client.start_build(
        projectName="paulhastings-staging",
        artifactsOverride={
            'type': 'CODEPIPELINE'
        }
    )
    return "Paul Hastings AWS Staging build triggered"
    
    print(response)