/**
 * check.js
 * Functions that perform a check on a single entry.
 * Local functions go on top, exported functions go on the bottom
 */
const defaultLocales = ['en-US', 'en-GB', 'ko', 'ja', 'fr', 'zh', 'de']
const richTextCharCount = field => {
  let count = 0

  if (typeof field.value === 'string') {
    return field.value.length
  }

  if (field.content) {
    field.content.forEach(c => {
      count += richTextCharCount(c)
    })
  }

  return count
}

const containsHtmlEntity = text => !!text.match(/&[a-z]+;/)
const containsSpecialA = text => !!text.match(/Ã/)

const defaultMatch = containsSpecialA

const containsSpecialChars = (text, regexString) => {
  if (regexString) {
    const flags = regexString.replace(/.*\/([gimy]*)$/, '$1')
    const pattern = regexString.replace(
      new RegExp('^/(.*?)/' + flags + '$'),
      '$1'
    )
    const regex = new RegExp(pattern, flags)
    return !!text.match(regex)
  } else {
    return defaultMatch(text)
  }
}

const richTextContainsSpecialChars = (field, regex) => {
  let found = false

  if (typeof field.value === 'string') {
    return containsSpecialChars(field.value, regex)
  }

  if (field.content) {
    field.content.forEach(c => {
      found = richTextContainsSpecialChars(c, regex) || found
    })
  }

  return found
}

const getFilteredFields = (fields, exclude = []) => {
  const entries = Object.entries(fields)
  return entries.filter(([key]) => !exclude.includes(key))
}

exports.checkDupOffices = entry => {
  const offices = entry.fields.offices && entry.fields.offices['en-US']
  if (!offices) return

  const officeMap = {}
  offices.forEach(o => {
    const id = o.sys.id
    if (officeMap[id]) {
      officeMap[id] = officeMap[id] + 1
    } else {
      officeMap[id] = 1
    }
  })

  const entries = Object.entries(officeMap)
  const invalidFields =
    entries && entries.filter(o => o[1] > 1).map(o => `${o[0]} (${o[1]})`)

  // Log all fields with errors
  if (invalidFields.length > 0) {
    return `Duplicate offices: ${invalidFields.join(', ')}`
  }
}

exports.checkCharLimit = (
  entry,
  limit = 6000,
  exclude = [],
  locales = defaultLocales
) => {
  const invalidFields = []
  for (const [key, outerVal] of getFilteredFields(entry.fields, exclude)) {
    locales.forEach(l => {
      const val = outerVal && outerVal[l]

      // Check short text fields
      if (typeof val === 'string' && val.length > limit) {
        invalidFields.push(`${key} [${l}]`)
      }

      // Check rich text fields
      if (typeof val === 'object' && val && val.content) {
        if (richTextCharCount(val) > limit) {
          invalidFields.push(`${key} [${l}]`)
        }
      }
    })
  }

  // Log all fields with errors
  if (invalidFields.length > 0) {
    return `Exceeded ${limit} characters for the following field(s): ${invalidFields.join(
      ', '
    )}`
  }
}

exports.checkSpecialChars = (
  entry,
  regex,
  exclude = [],
  locales = defaultLocales
) => {
  const invalidFields = []
  getFilteredFields(entry.fields, exclude)

  for (const [key, outerVal] of getFilteredFields(entry.fields, exclude)) {
    locales.forEach(l => {
      const val = outerVal && outerVal[l]

      // Check short text fields
      if (typeof val === 'string' && containsSpecialChars(val, regex)) {
        invalidFields.push(`${key} [${l}]`)
      }

      // Check rich text fields
      if (typeof val === 'object' && val && val.content) {
        if (richTextContainsSpecialChars(val, regex)) {
          invalidFields.push(`${key} [${l}]`)
        }
      }
    })
  }

  // Log all fields with errors
  if (invalidFields.length > 0) {
    return `Found special chars for the following field(s): ${invalidFields.join(
      ', '
    )}`
  }
}

// TODO: test with contentful data, simulate broken links
exports.checkBrokenLinks = (
  entry,
  entries,
  linkedEntries,
  linkedAssets,
  exclude = [],
  locales = defaultLocales
) => {
  const invalidFields = []
  for (const [key, outerVal] of getFilteredFields(entry.fields, exclude)) {
    locales.forEach(l => {
      const val = outerVal && outerVal[l]

      // Linked Entries/Assets are arrays
      if (Array.isArray(val) && val.length > 0) {
        const links = []
        val.forEach(v => {
          if (v && v.sys) {
            const id = v.sys.id
            const type = v.sys.type
            const isFound =
              type === 'Entry'
                ? linkedEntries.find(e => id === e.sys.id) ||
                  entries.find(e => id === e.sys.id)
                : linkedAssets.find(a => id === a.sys.id)
            if (!isFound) {
              links.push(v)
            }
          }
        })
        if (links.length > 0) {
          const errors = links.map(l => l.sys.id)
          invalidFields.push(`${key} on ${errors.join(', ')}`)
        }
      }
    })
  }

  // Log all fields with errors
  if (invalidFields.length > 0) {
    return `Broken links were found for the following fields: ${invalidFields.join(
      ', '
    )}`
  }
}
