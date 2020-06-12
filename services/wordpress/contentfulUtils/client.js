const contentful = require("contentful-management");
require("dotenv").config({
  path: `.env`,
});

// Contentful Config
const spaceID = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_MANAGEMENT_API;
const environment = process.env.CONTENTFUL_ENVIRONMENT;

const showWarnings = false;

const logHandler = (level, data) => {
  if (showWarnings || level !== "warning") {
    console.log(`${level} | ${data}`);
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
