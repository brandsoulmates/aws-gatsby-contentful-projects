var codebuild = new AWS.CodeBuild();








var paramsCodeBuild = {
  artifacts: { /* required */
    type: NO_ARTIFACTS, /* required */
  },
  environment: { /* required */
    computeType: BUILD_GENERAL1_SMALL, /* required */
    image: 'aws/codebuild/standard:3.0', /* required */
    type: LINUX_CONTAINER, /* required */
    environmentVariables: [
      {
        name: 'STRING_VALUE', /* required */
        value: 'STRING_VALUE', /* required */
        type: PLAINTEXT | PARAMETER_STORE | SECRETS_MANAGER
      },
      /* more items */
    ],
    imagePullCredentialsType: CODEBUILD | SERVICE_ROLE,
    privilegedMode: true || false,
    registryCredential: {
      credential: 'STRING_VALUE', /* required */
      credentialProvider: SECRETS_MANAGER /* required */
    }
  },
  name: serviceName, /* required */
  serviceRole: 'STRING_VALUE', /* required */
  source: { /* required */
    type: GITHUB, /* required */
    auth: {
      type: OAUTH, /* required */
      resource: 'STRING_VALUE'
    },
    buildspec: 'buildspec.yml',
    location: 'STRING_VALUE',
    reportBuildStatus: true,
    sourceIdentifier: 'STRING_VALUE'
  },
  badgeEnabled: false,
  cache: {
    type: NO_CACHE | S3 | LOCAL, /* required */
    location: 'STRING_VALUE',
    modes: [
      LOCAL_DOCKER_LAYER_CACHE | LOCAL_SOURCE_CACHE | LOCAL_CUSTOM_CACHE,
      /* more items */
    ]
  },
  description: 'STRING_VALUE',
  encryptionKey: 'STRING_VALUE',
  fileSystemLocations: [
    {
      identifier: 'STRING_VALUE',
      location: 'STRING_VALUE',
      mountOptions: 'STRING_VALUE',
      mountPoint: 'STRING_VALUE',
      type: EFS
    },
    /* more items */
  ],
  logsConfig: {
    cloudWatchLogs: {
      status: ENABLED | DISABLED, /* required */
      groupName: 'STRING_VALUE',
      streamName: 'STRING_VALUE'
    },
    s3Logs: {
      status: ENABLED | DISABLED, /* required */
      encryptionDisabled: true || false,
      location: 'STRING_VALUE'
    }
  },
  secondaryArtifacts: [
    {
      type: CODEPIPELINE | S3 | NO_ARTIFACTS, /* required */
      artifactIdentifier: 'STRING_VALUE',
      encryptionDisabled: true || false,
      location: 'STRING_VALUE',
      name: 'STRING_VALUE',
      namespaceType: NONE | BUILD_ID,
      overrideArtifactName: true || false,
      packaging: NONE | ZIP,
      path: 'STRING_VALUE'
    },
    /* more items */
  ],
  secondarySourceVersions: [
    {
      sourceIdentifier: 'STRING_VALUE', /* required */
      sourceVersion: 'STRING_VALUE' /* required */
    },
    /* more items */
  ],
  secondarySources: [
    {
      type: CODECOMMIT | CODEPIPELINE | GITHUB | S3 | BITBUCKET | GITHUB_ENTERPRISE | NO_SOURCE, /* required */
      auth: {
        type: OAUTH, /* required */
        resource: 'STRING_VALUE'
      },
      buildspec: 'STRING_VALUE',
      gitCloneDepth: 'NUMBER_VALUE',
      gitSubmodulesConfig: {
        fetchSubmodules: true || false /* required */
      },
      insecureSsl: true || false,
      location: 'STRING_VALUE',
      reportBuildStatus: true || false,
      sourceIdentifier: 'STRING_VALUE'
    },
    /* more items */
  ],
  sourceVersion: 'STRING_VALUE',
  tags: [
    {
      key: 'STRING_VALUE',
      value: 'STRING_VALUE'
    },
    /* more items */
  ],
  vpcConfig: {
    securityGroupIds: [
      'STRING_VALUE',
      /* more items */
    ],
    subnets: [
      'STRING_VALUE',
      /* more items */
    ],
    vpcId: 'STRING_VALUE'
  }
};

const createCodeBuild = () => {
  codebuild.createProject(paramsCodeBuild, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
}

