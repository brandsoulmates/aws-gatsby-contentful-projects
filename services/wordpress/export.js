const { spawn } = require("child_process");
require("dotenv").config({
  path: `.env`,
});

const exportCurrentContentfulData = async () => {
  const ls = spawn("contentful", [
    "space",
    "export",
    `--space-id=${process.env.CONTENTFUL_SPACE_ID}`,
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
