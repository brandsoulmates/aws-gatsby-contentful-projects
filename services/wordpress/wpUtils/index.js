const { exportBlogposts } = require("./exportBlogposts");
const { getTags } = require("./getTags");
const { getAssets } = require("./getAssets");
const { getCategories } = require("./getCategories");
const { transformPosts } = require("./processPosts");

module.exports = {
  exportBlogposts,
  getAssets,
  getCategories,
  transformPosts,
  getTags,
};
