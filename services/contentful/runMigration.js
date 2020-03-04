const runMigration = require('contentful-migration/built/bin/cli').runMigration
const path = require('path')
const config = require('./.contentfulrc.json')

const options = {
  spaceId: config.activeSpaceId,
  accessToken: config.managementToken,
  environmentId: config.activeEnvironmentId,
}

const migrations = async () => {
  await runMigration({...options, ...{filePath: path.resolve('migrations/navigation-1563822662200.js')}})
  await runMigration({...options, ...{filePath: path.resolve('migrations/navigationItem-1563822667934.js')}})
  await runMigration({...options, ...{filePath: path.resolve('migrations/contentBlock-1563823042500.js')}})
  await runMigration({...options, ...{filePath: path.resolve('migrations/layout-1563823882264.js')}})
  await runMigration({...options, ...{filePath: path.resolve('migrations/page-1563824114431.js')}})
  await runMigration({...options, ...{filePath: path.resolve('migrations/practiceArea-1563824351751.js')}})
  await runMigration({...options, ...{filePath: path.resolve('migrations/office-1563824586287.js')}})
  await runMigration({...options, ...{filePath: path.resolve('migrations/link-1565137756238.js')}})
  await runMigration({...options, ...{filePath: path.resolve('migrations/professional-1565137748296.js')}})
  await runMigration({...options, ...{filePath: path.resolve('migrations/article-1563820386.js')}})
  await runMigration({...options, ...{filePath: path.resolve('migrations/article-group-1563817243.js')}})
  await runMigration({...options, ...{filePath: path.resolve('migrations/publication-1563825468092.js')}})
  await runMigration({...options, ...{filePath: path.resolve('migrations/event-1563825789244.js')}})
  await runMigration({...options, ...{filePath: path.resolve('migrations/news-1563826130147.js')}})
}

migrations()
