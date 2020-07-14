const yargs = require("yargs");
const fs = require("fs");

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

const main = async () => {
  const [filepath1, filepath2] = argv._;
};

main();
