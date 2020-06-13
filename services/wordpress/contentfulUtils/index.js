const {
  getContentfulClient,
  getContentfulEnvironment,
  getContentfulSpace,
} = require("./client");
const { createAndPublishAssets, purgeAssets } = require("./assets");

module.exports = {
  purgeAssets,
  getContentfulClient,
  getContentfulEnvironment,
  getContentfulSpace,
  createAndPublishAssets,
};
