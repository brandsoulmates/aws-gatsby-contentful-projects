/**
 * find.js
 * Functions that scan all entries in question
 */

const { buildEntryJson, buildGroupedJson } = require('./data')
const defaultLocales = ['en-US', 'en-GB', 'ko', 'ja', 'fr', 'zh', 'de']

exports.findDupSlugs = (entries, testType, locales = defaultLocales) => {
  const data = []
  const slug2EntryMap = {}
  entries.forEach(e => {
    locales.forEach(l => {
      const key = e.fields && e.fields.slug && e.fields.slug[l]
      const val = buildEntryJson(e, testType, l)

      if (key) {
        if (Array.isArray(slug2EntryMap[key])) {
          slug2EntryMap[key].push(val)
        } else {
          slug2EntryMap[key] = [val]
        }
      }
    })
  })

  for (const [key, val] of Object.entries(slug2EntryMap)) {
    if (val.length > 1) {
      data.push({ slug: key, entries: val })
    }
  }

  const testname = 'Find Duplicate Slugs'
  return buildGroupedJson(data, testname, testType)
}

exports.findDupIDs = (entries, testType) => {
  const data = []
  const id2EntryMap = {}
  entries.forEach(e => {
    const key = e.sys.id
    const val = buildEntryJson(e, testType)

    if (key) {
      if (Array.isArray(id2EntryMap[key])) {
        id2EntryMap[key].push(val)
      } else {
        id2EntryMap[key] = [val]
      }
    }
  })

  for (const [key, val] of Object.entries(id2EntryMap)) {
    if (val.length > 1) {
      data.push({ id: key, entries: val })
    }
  }

  const testname = 'Find Duplicate IDs'
  return buildGroupedJson(data, testname, testType)
}

exports.findAllFieldsFilled = (entries, testType, exclude) => {
  // let allFieldsFilled = true
  // for (const [key, val] of getFilteredFields(entry.fields, exclude)) {
  //   if (typeof val === 'string' && !val) {
  //     allFieldsFilled = false
  //   }

  //   if (typeof val === 'object') {
  //     if (Array.isArray(val) && val.length === 0) {
  //       allFieldsFilled = false
  //     } else if (val && val.content && val.content.length === 0) {
  //       allFieldsFilled = false
  //     }
  //   }
  // }

  // TODO: Null fields are not in json response from api call => always return true
  // Try to get all fields from content model?
  // return allFieldsFilled
  const testname = 'Find All Fields Filled (feature not yet complete)'
  return buildGroupedJson([], testname, testType)
}
