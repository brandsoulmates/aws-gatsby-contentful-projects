const {
  getContentfulClient,
  getContentfulEnvironment,
  getContentfulSpace,
} = require("./client");
const { createAndPublishAssets, deleteAssets } = require("./assets");
const { createAndPublishEntries } = require("./entries");

module.exports = {
  deleteAssets,
  getContentfulClient,
  getContentfulEnvironment,
  getContentfulSpace,
  createAndPublishAssets,
  createAndPublishEntries,
};
