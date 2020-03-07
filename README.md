## ayz JAMstack setup

## Getting started
2. **Install [yarn](https://classic.yarnpkg.com/en/docs/install/)**. This package manager is to be used with the configurable `package.json` file.
3. **Install required packages** with `$ yarn`.

### Install
1. **Install [yarn](https://classic.yarnpkg.com/en/docs/install/)**. In below commands, we install via Homebrew.
2. **Install preferred code editor's command into PATH.** For this example, we'll use VS Code's `code-insiders`.
3. **Install cli tools** for Gatsby, Contentful, AWS, and Github: `gatsby`, `contentful-cli`, `aws`, and `gh`.
4. **Clone this repo**, if you haven't already.
5. **Navigate to this repo's folder.**
6. **Clone .env.sample to .env.** Fill out GATSBY_CLIENT_NICKNAME=coh. For example, GATSBY_CLIENT_NICKNAME=coh

Together:
```
$ brew install yarn
$ yarn global add contentful-cli aws gatsby gh
$ git clone https://github.com/brandsoulmates/aws-gatsby-contentful-projects
$ code-insiders aws-gatsby-contentful-projects

```

### Configure Git
1. Clone your desired repo to `client`, or use the base repo in `client`.
2. Create a new repo. For our purposes, we're using the Ayz org. Use a client nickname.
Please note, whatever you put as your client nickname, you'll be using on Contentful and AWS as well.
3. Push the frontend client to the repo.
4. Save the repo url to the config file.

```
$ gh repo create brandsoulmates/CLIENT_NICKNAME
// authenticate in browser, follow prompts
$ cd client
$ git init
// OR if git already exists
$ rm -rf .git
$ git init
$ git submodule add <url> client
$ git add .
$ git commit -m 'first commit
$ git remote add origin https://github.com/brandsoulmates/CLIENT_NICKNAME.git
$ git push -u origin master
// save https://github.com/brandsoulmates/CLIENT_NICKNAME.git to variable

```

### Configure Contentful
1. Login to Contentful through the CLI. It will help you to create a free account if you don't have one already.
2. Create a new space: `contentful space create --name 'CLIENT_NICKNAME'`
3. Select the spae you just created.
4. Seed the new space with the example content model. 
5. Duplicate the existing branches and configure the rest of the env.
6. TODO - write env files to env

Step 4: Seed the new space with the example content model the-example-app. Replace the SPACE_ID with the id returned from the create command executed in step 3

```
$ contentful login
$ contentful space create --name REPLACEMECLIENTNICKNAME
$ contentful space use --space-id REPLACEMECLIENTNICKNAME --environment-id master
$ contentful space import --content-file='./services/contentful/model/base-model.json'
$ yarn contentful

```

### Configure AWS

*mvp* 
- [x] s3
- [x] cloudfront mvp
- [ ] lambda
- [ ] iam 

*v2*
- [ ] acm
- [ ] route53
- [ ] cloudfront w/ acm route 53

// TO DO
You will need: 

AWS:
1. You will need an administrator or IAM user in your AWS account with permission to perform the following minimum set of actions:

iam:AddRoleToInstanceProfile
iam:AttachRolePolicy
iam:CreateInstanceProfile
iam:CreatePolicy
iam:CreateRole
iam:GetRole
iam:ListAttachedRolePolicies
iam:ListPolicies
iam:ListRoles
iam:PassRole
iam:PutRolePolicy
iam:UpdateAssumeRolePolicy

2. Get and save AWS access keys 


## Contentful 

### Content Model Migrations

1. Run migrations using `yarn migrate`
2. Changes to the content models can be found in the _migrations_ folder.
3. Migration scripts are suffixed with an Epoch time stamp. https://www.epochconverter.com/

#### How to generate content model migrations

Migrations can be generated from the current Contentful space using the _contentful-cli_ and the following command:
`contentful space generate migration -c ContentType`

### Content Updates

### Health check logs
These scripts were created to scan entries from Contentful for errors. It has been scaled to support scanning for multiple content types and specific ID's, as well as many other options.

### Setup

1. **Configure environment variables.** These variables are used to make the correct contentful client connection for querying data. Add the following variables to your local `.env` file:

   - CONTENTFUL_SPACE_ID
   - CONTENTFUL_ACCESS_TOKEN
   - CONTENTFUL_ENVIRONMENT


### Commands

To test all entries across all content types for errors, run :

```
$ yarn test
```

Because sitefinity migration scripts kept the special characters in the rich text fields, entries will always fail the special-chars test. Therefore, we will exclude these fields from the tests by default. To not use this default exclusion, run:

```
$ yarn test:all
```

To find entries across all content types for duplicate fields (slugs/ids), run:

```
$ yarn find
```

For help and more info about the option flags, run:

```
$ yarn test -h

or

$ yarn find -h
```