const { purgeAssets } = require("./purgeAssets");
const {
  getContentfulClient,
  getContentfulEnvironment,
  getContentfulSpace,
} = require("./client");
const { createAndPublishAssets } = require("./assets");

module.exports = {
  purgeAssets,
  getContentfulClient,
  getContentfulEnvironment,
  getContentfulSpace,
  createAndPublishAssets,
};
