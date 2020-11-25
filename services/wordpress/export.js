const { spawn } = require("child_process");
const yargs = require("yargs");
const fs = require("fs");
require("dotenv").config({
  path: `.env`,
});

// Get Options
const argv = yargs
  .option("output", {
    alias: "o",
    description: "Specify the name of the output file. Defaults to check.json",
    type: "string",
  })
  .help()
  .alias("help", "h").argv;

const exportCurrentContentfulData = async () => {
  const outputFilename =
    argv.output ||
    `contentful-export-${new Date()
      .toJSON()
      .slice(0, 16)
      .replace(/T/g, "-")}.json`;

  const ls = spawn("contentful", [
    "space",
    "export",
    `--space-id=${process.env.CONTENTFUL_SPACE_ID}`,
    `--content-file=${outputFilename}`,
  ]);
  ls.stdout.on("data", (data) => {
    console.log(`${data}`);
  });
  ls.stderr.on("data", (data) => {
    console.log(`stderr: ${data}`);
  });
  ls.on("error", (error) => {
    console.log(`error: ${error.message}`);
  });
  ls.on("close", (code) => {
    console.log(`child process exited with code ${code}`);
  });
};

exportCurrentContentfulData();

// module.exports = { exportCurrentContentfulData };
