### Contentful Logs

These scripts were created to scan entries from Contentful for errors. It has been scaled to support scanning for multiple content types and specific ID's, as well as many other options.

### Setup

1. **Configure environment variables.** These variables are used to make the correct contentful client connection for querying data. Add the following variables to your local `.env` file:

   - CONTENTFUL_SPACE_ID
   - CONTENTFUL_ACCESS_TOKEN
   - CONTENTFUL_ENVIRONMENT

2. **Install [yarn](https://classic.yarnpkg.com/en/docs/install/)**. This package manager is to be used with the configurable `package.json` file.
3. **Install required packages** with `$ yarn`.

### Quickstart

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

### TODO

- Add script for updating content across multiple branches
