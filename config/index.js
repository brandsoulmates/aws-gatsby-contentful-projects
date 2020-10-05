require('dotenv').config()
module.exports = {
  clientName: 'ayzenbergdotcom',
  nickName: process.env.GATSBY_CLIENT_NICKNAME,
  version: '1',
  cms: 'contentful',
  host: 'ayzenbergdotcom',
  github: {
    base: 'https://github.com',
    org: 'brandsoulmates',
    repo: process.env.GATSBY_GITHUB_REPO
  },
  branch: process.env.GATSBY_CONTENTFUL_ENVIRONMENT || 'master',
  region: 'us-east-1',
  user: 'ngerlach',
  canonicalUserId: process.env.GATSBY_AWS_CANONICAL_USER_ID,
  environments: ['development', 'staging', 'qa', 'production'],
  cms: {
    contentful: {
      managementAccessTokenSecret: process.env.GATSBY_CONTENTFUL_MANAGEMENT_API,
      deliveryAccessToken: process.env.GATSBY_CONTENTFUL_DELIVERY_API,
      previewAccessToken: process.env.GATSBY_CONTENTFUL_PREVIEW_API,
      spaceId: process.env.GATSBY_CONTENTFUL_SPACE_ID,
      environment: process.env.GATSBY_CONTENTFUL_ENVIRONMENT || 'development',
      host: process.env.GATSBY_CONTENTFUL_HOST || 'cdn.contentful.com',
      previewMode: process.env.GATSBY_APOLLO_PREVIEW || false,
    }
  },
  baseServiceName: process.env.GATSBY_CLIENT_NICKNAME + '-' + '-' + process.env.GATSBY_CONTENTFUL_ENVIRONMENT,
  accessKeyId: process.env.GATSBY_AWS_ACCESS_KEY,
  secretAccessKey: process.env.GATSBY_AWS_SECRET_ACCESS_KEY,
  ACL: 'private', // private | public-read | public-read-write | authenticated-read,
  apiVersions: {
    s3: '2006-03-01',
    cloudFront: '2019-03-26'
  },
  descriptions: {
    development: "Managed continuous integration service to compile, test, and deploy development branch source code as software package to Development site. The development site contains all the latest iterations of the code the engineering team is working on.",
    qa: "Managed continuous integration service to compile, test, and deploy development branch source code as software package to QA site. The QA site contains all the latest iterations of the code the engineering team is working on.",
    staging: "Managed continuous integration service to compile, test, and deploy staging branch source code as a software package to Staging. The staging site acts as the bridge between the QA and live versions of PaulHastings.com.",
    production: "Managed continuous integration service to compile, test, and deploy production branch source code as software package to Production website. This is the version of PaulHastings.com that users will see.",
    preview: "Managed continuous integration service to compile, test, and deploy preview branch source code as packaged software. CMS users are able to directly preview the appearance of site with content changes"
  }
}



