const {
  getContentfulClient,
  getContentfulEnvironment,
  getContentfulSpace,
} = require("./client");
const { createAndPublishAssets, deleteAssets } = require("./assets");

module.exports = {
  deleteAssets,
  getContentfulClient,
  getContentfulEnvironment,
  getContentfulSpace,
  createAndPublishAssets,
};
