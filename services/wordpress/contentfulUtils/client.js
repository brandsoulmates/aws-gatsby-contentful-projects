const contentful = require("contentful-management");
const chalk = require("chalk"); // make it pretty
require("dotenv").config({
  path: `.env`,
});

// Contentful Config
const spaceID = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_MANAGEMENT_API;
const environment = process.env.CONTENTFUL_ENVIRONMENT;

const showWarnings = process.env.SHOW_CONTENTFUL_WARNINGS || false;

const logHandler = (level, data) => {
  switch (level) {
    case "warning":
      if (showWarnings) console.log(`${chalk.yellow(level)} ${data}`);
      break;
    case "error":
      const title = [data.name, data.message].filter((a) => a).join(" - ");
      console.error(`${chalk.red(level)} ${title}`);
      console.error(data);
      break;
    case "info":
      console.log(`${chalk.blue(level)} ${data}`);
    default:
      console.log(`[${level}] ${data}`);
  }
};

const client = contentful.createClient({
  accessToken,
  logHandler,
});

exports.getContentfulClient = () => client;
exports.getContentfulSpace = async () => await client.getSpace(spaceID);
exports.getContentfulEnvironment = async () =>
  await (await this.getContentfulSpace()).getEnvironment(environment);
