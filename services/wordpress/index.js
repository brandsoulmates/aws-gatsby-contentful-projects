const { exportBlogposts } = require("./exportBlogposts");
const { transformPosts } = require("./processPosts");
const { getCategories } = require("./getCategories");
const { getAssets } = require("./getAssets");

// Reference: https://hoverbaum.net/2018/03/22/Wordpress-to-Contentful-migration/

const main = async () => {
  const apiUrl = "https://www.ayzenberg.com/wp-json/wp/v2";

  // 1 Get posts from WP
  const posts = await exportBlogposts(`${apiUrl}/posts`);

  // 2 Process posts
  const processedPosts = transformPosts(posts);

  // 3 Get categories fron WP
  const categories = await getCategories(
    processedPosts,
    `${apiUrl}/categories`
  );

  // 4 Create list of assets needed from WP
  const assets = await getAssets(processedPosts, `${apiUrl}/media`);

  // 5 Create and publish assets in Contentful

  // 6 Create and publish categories in Contentful

  // 7 Create, link and publish posts
};

main();
