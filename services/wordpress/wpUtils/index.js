const { exportBlogposts } = require("./exportBlogposts");
const { getAssets } = require("./getAssets");
const { getCategories } = require("./getCategories");
const { transformPosts } = require("./processPosts");

module.exports = {
  exportBlogposts,
  getAssets,
  getCategories,
  transformPosts,
};
