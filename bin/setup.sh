#!/usr/bin/bash
brew install yarn
yarn global add contentful-cli aws gatsby gh
git clone https://github.com/brandsoulmates/aws-gatsby-contentful-projects
code-insiders aws-gatsby-contentful-projects


gh repo create brandsoulmates/CLIENT_NICKNAME
// authenticate in browser, follow prompts
cd client
git init
// OR if git already exists
rm -rf .git
git init
git add .
git commit -m 'first commit
git remote add origin https://github.com/brandsoulmates/CLIENT_NICKNAME.git
git push -u origin master
// save https://github.com/brandsoulmates/CLIENT_NICKNAME.git to variable