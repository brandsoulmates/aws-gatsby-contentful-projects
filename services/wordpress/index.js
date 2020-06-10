const { exportBlogposts } = require("./exportBlogposts");
const { transformPosts } = require("./processPosts");
const { getCategories } = require("./getCategories");
const { getAssets } = require("./getAssets");

// Reference: https://hoverbaum.net/2018/03/22/Wordpress-to-Contentful-migration/

const main = async () => {
  const apiUrl = "https://www.ayzenberg.com/wp-json/wp/v2";

  const posts = await exportBlogposts(`${apiUrl}/posts`);
  const processedPosts = transformPosts(posts);
  const categories = await getCategories(
    processedPosts,
    `${apiUrl}/categories`
  );

  // Create list of assets needed from WP
  const assets = await getAssets(processedPosts, `${apiUrl}/media`);

  // Create and publish assets in Contentful

  // Create and publish categories in Contentful

  // Create, link and publish posts
};

main();
