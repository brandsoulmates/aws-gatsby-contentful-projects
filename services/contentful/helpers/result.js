/**
 * result.js
 * The main functions for data parsing, manipulation, and controlling
 * which tests to run.
 */

const fs = require("fs");
const path = require("path");
const {
  getJoinedEntries,
  attemptToGetEntries,
  buildEntryJson,
  buildGroupedJson,
  buildOutputJson
} = require("./data");
const {
  checkCharLimit,
  checkBrokenLinks,
  checkSpecialChars,
  checkDupOffices
} = require("./check");
const { findDupSlugs, findAllFieldsFilled, findDupIDs } = require("./find");

const defaultAllTests = [
  "article",
  "event",
  "news",
  "office",
  "practiceArea",
  "professional"
];

const checkEntries = (argv, testType, entries) => {
  const specifiedTest = argv.test;
  const [items, linkedEntries, linkedAssets] = entries;
  const data = [];
  items.forEach(entry => {
    let errors = [];
    const charLimitError =
      (!specifiedTest || specifiedTest === "char-limit") &&
      checkCharLimit(entry, argv.limit, argv.exclude, argv.locales);
    const linkErrors =
      (!specifiedTest || specifiedTest === "broken-links") &&
      checkBrokenLinks(
        entry,
        items,
        linkedEntries,
        linkedAssets,
        argv.exclude,
        argv.locales
      );
    const specialCharError =
      (!specifiedTest || specifiedTest === "special-chars") &&
      checkSpecialChars(entry, argv.match, argv.exclude, argv.locales);

    const dupOfficesError =
      (!specifiedTest || specifiedTest === "dup-offices") &&
      checkDupOffices(entry);

    // Default tests
    if (charLimitError) errors.push(charLimitError);
    if (linkErrors) errors.push(linkErrors);
    if (specialCharError) errors.push(specialCharError);
    if (dupOfficesError) errors.push(dupOfficesError);

    // > 6k Special Chars
    // if (charLimitError && specialCharError) {
    //   errors.push(charLimitError)
    //   errors.push(specialCharError)
    // }

    if (errors.length > 0) {
      data.push(buildEntryJson(entry, testType, errors));
    }
  });
  return { data, message: "" };
};

const findEntries = (argv, testType, entries) => {
  const specifiedTest = argv.test;
  const tests = [];
  if (!specifiedTest || specifiedTest === "dup-slug") {
    const result = findDupSlugs(entries, testType, argv.locales);
    tests.push(result);
  }
  if (!specifiedTest || specifiedTest === "dup-ids") {
    const result = findDupIDs(entries, testType);
    tests.push(result);
  }
  if (!specifiedTest || specifiedTest === "all-fields-filled") {
    const result = findAllFieldsFilled(entries, testType, argv.exclude);
    tests.push(result);
  }
  return tests;
};

const getTestResult = async (argv, contentType, testType) => {
  const { data, message } = await attemptToGetEntries(argv, contentType);
  if (data.length === 0) {
    return { data, message };
  }

  console.log(`Running tests for ${contentType}...`);
  return checkEntries(argv, testType, data);
};

exports.getTestResults = async (argv, testType) => {
  const types2Check = argv["content-types"] || defaultAllTests;

  if (testType === "find") {
    const entries = await getJoinedEntries(argv, types2Check);
    return findEntries(argv, testType, entries);
  }

  return await Promise.all(
    types2Check.map(async contentType => {
      const { data, message } = await getTestResult(
        argv,
        contentType,
        testType
      );
      return buildGroupedJson(data, contentType, testType, message);
    })
  );
};

exports.writeToJson = (argv, testType, tests) => {
  // Create filename
  const dirPath = path.resolve(__dirname, "../out");
  const filename = path.resolve(dirPath, argv.output || `${testType}.json`);

  // Construct output file
  const output = JSON.stringify(buildOutputJson(tests, testType), null, 2);

  // Write to existing directory or create a new one
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
  fs.writeFile(filename, output, err => {
    if (err) throw err;
  });

  console.log(
    `Finished running tests. \nPlease check the output file ${filename}`
  );
};

const defaultTempDirPath = path.resolve(__dirname, "../temp");
const defaultTempFilename = path.resolve(defaultTempDirPath, "temp.json");
const getFilepath = filename =>
  (filename && path.resolve(defaultTempDirPath, `${filename}.json`)) ||
  defaultTempFilename;

exports.writeToTempJson = (tempFilename, data, message) => {
  const output = JSON.stringify(data, null, 2);
  const filepath = getFilepath(tempFilename);

  // Write to existing directory or create a new one
  if (!fs.existsSync(defaultTempDirPath)) {
    fs.mkdirSync(filepath);
  }
  fs.writeFile(filepath, output, err => {
    if (err) throw err;
  });

  // console.log(`Pending changes can be found in ${filepath}`)
  console.log(`Wrote to ${filepath}`);
};

exports.readFromTempJson = filename => {
  const filepath = getFilepath(filename);

  if (!fs.existsSync(filepath)) {
    console.log(`Error: file could not be found at ${filepath}`);
    return null;
  }
  const data = fs.readFileSync(filepath, "utf8");
  return JSON.parse(data);
};
