const yargs = require("yargs");
const fs = require("fs");
const JSdiff = require("diff");
const { stringify } = require("querystring");
require("colors");

const isValidJSONString = (str) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

// Get Options
const argv = yargs
  .check((argv) => {
    const filePaths = argv._;
    if (filePaths.length !== 2) {
      throw new Error("2 paths to exported json files required.");
    }

    filePaths.forEach((path) => {
      if (!fs.existsSync(path)) {
        throw new Error(`Error: file could not be found at "${path}"`);
      }

      const data = fs.readFileSync(path, "utf8");
      if (!path.endsWith(".json") || !isValidJSONString(data)) {
        throw new Error(`"${path}" is not a valid json file.`);
      }
    });

    return true; // tell Yargs that the arguments passed the check
  })
  .help()
  .alias("help", "h").argv;

const formatOutput = (diff, type) => {
  const { added, removed, value, count } = diff;
  // const changed = added || removed;

  if (added || removed) {
    // console.log(`${{ [changed]: value }}`);
    return { [`${type} ${added ? "added" : "removed"}`]: value };
  }
  return null;

  // if (removed) {
  //   console.log("removed", value);
  // }
  // if (added) {
  //   console.log("added", value);
  // }
};

const formatAssets = (assets) => {
  const locale = "en-US";

  return assets.map(({ sys: { id }, fields: { title, name } }) => ({
    id,
    title: title ? title[locale] : name,
  }));
};

const main = async () => {
  const [filepath1, filepath2] = argv._;
  const json1 = JSON.parse(fs.readFileSync(filepath1, "utf8"));
  const json2 = JSON.parse(fs.readFileSync(filepath2, "utf8"));

  const { assets: assets1, entries: entries1 } = json1;
  const { assets: assets2, entries: entries2 } = json2;

  console.log("Asset Changes");

  let diffAssets = JSdiff.diffArrays(
    formatAssets(assets1),
    formatAssets(assets2)
  );
  let diffEntries = JSdiff.diffArrays(
    formatAssets(entries1),
    formatAssets(entries2)
  );

  const formattedDiffAssets = diffAssets.map((part) =>
    formatOutput(part, "Assets")
  );
  const formattedDiffEntries = diffEntries.map((part) =>
    formatOutput(part, "Entries")
  );
  const formattedDiff = [...formattedDiffAssets, ...formattedDiffEntries];

  console.log(formattedDiff);

  // diff.forEach(function (part) {
  //   // green for additions, red for deletions
  //   // grey for common parts
  //   var color = part.added ? "green" : part.removed ? "red" : "grey";
  //   if (color === "green" || color === "red")
  //     process.stderr.write(part.value[color]);
  // });

  // console.log(diff);
  // console.log(JSON.parse(JSON.stringify({ diff })));
  const prettified = JSON.stringify(formattedDiff, null, 2);
  fs.writeFile("test.json", prettified, (err) => {
    if (err) throw err;
  });

  // console.log(prettified);
};

main();
