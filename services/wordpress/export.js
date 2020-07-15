const { spawn } = require("child_process");
const yargs = require("yargs");
const fs = require("fs");
const { argv } = require("process");
require("dotenv").config({
  path: `.env`,
});

// Get Options
// const argv = yargs
//   .check((argv) => {
//     const filePaths = argv._;
//   })
//   .help()
//   .alias("help", "h").argv;

const exportCurrentContentfulData = async () => {
  console.log(argv);
  // const ls = spawn("contentful", [
  //   "space",
  //   "export",
  //   `--space-id=${process.env.CONTENTFUL_SPACE_ID}`,
  // ]);
  // ls.stdout.on("data", (data) => {
  //   console.log(`${data}`);
  // });
  // ls.stderr.on("data", (data) => {
  //   console.log(`stderr: ${data}`);
  // });
  // ls.on("error", (error) => {
  //   console.log(`error: ${error.message}`);
  // });
  // ls.on("close", (code) => {
  //   console.log(`child process exited with code ${code}`);
  // });
};

exportCurrentContentfulData();

// module.exports = { exportCurrentContentfulData };
