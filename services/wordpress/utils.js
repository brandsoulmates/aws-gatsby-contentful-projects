const fetch = require("node-fetch");
const chalk = require("chalk");

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
      console.log(message);
  }
};
