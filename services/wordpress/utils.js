const fetch = require("node-fetch");
const chalk = require("chalk");
const fs = require("fs");
const path = require("path");

exports.getJSON = async (url) => {
  try {
    const response = await fetch(url);
    if (response.ok) return await response.json();
  } catch (error) {
    console.error(error);
  }
  return null;
};

exports.log = (level, message, newSection) => {
  if (newSection) console.log("");
  switch (level) {
    case "info":
      console.log(`${chalk.blue(level)} ${message}`);
      break;
    case "success":
      console.log(`${chalk.green(level)} ${message}`);
      break;
    case "warning":
      console.log(`${chalk.yellow(level)} ${message}`);
      break;
    case "error":
      console.error(`${chalk.red(level)} ${message}`);
      break;
    case "progress":
      console.log(chalk.dim(`...${message}`));
      break;
    default:
      console.log(level, message);
  }
};

exports.getUniqueImages = (arr) => {
  return Array.from(new Set(arr.map((a) => a.link))).map((link) => {
    return arr.find((a) => a.link === link);
  });
};

exports.writeToJson = (richtext, input) => {
  // Create filename
  const dirPath = path.resolve(__dirname, "../../out");
  const filename = path.resolve(dirPath, `${richtext}.json`);

  // Construct output file
  const output = JSON.stringify(input);

  // Write to existing directory or create a new one
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath);
  }
  fs.writeFile(filename, output, (err) => {
    if (err) throw err;
  });

  console.log(
    `Finished running tests. \nPlease check the output file ${filename}`
  );
};
