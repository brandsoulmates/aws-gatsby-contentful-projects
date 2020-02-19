import boto3, json

def lambda_handler(event, context):
    
    client = boto3.client('codebuild')
    
    response = client.start_build(
        projectName="paulhastings-prod",
        artifactsOverride={
            'type': 'CODEPIPELINE'
        }
    )
    return "Paul Hastings AWS Prod build triggered"
    
    print(response)