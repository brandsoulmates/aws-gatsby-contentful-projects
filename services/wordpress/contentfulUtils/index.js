const {
  getContentfulClient,
  getContentfulEnvironment,
  getContentfulSpace,
} = require("./client");
const { createAndPublishAssets, deleteAssets } = require("./assets");
const { createAndPublishEntries, deleteEntries } = require("./entries");
const {
  CONTENT_TYPES,
  createContentType,
  getPopulatedEntryFields,
} = require("./contentTypes");

module.exports = {
  deleteAssets,
  deleteEntries,
  getContentfulClient,
  getContentfulEnvironment,
  getContentfulSpace,
  createAndPublishAssets,
  createAndPublishEntries,
  CONTENT_TYPES,
  createContentType,
  getPopulatedEntryFields,
};
