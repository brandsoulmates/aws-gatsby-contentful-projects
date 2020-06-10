const { exportBlogposts } = require("./exportBlogposts");
const { transformPosts } = require("./processPosts");
const { generateAssetsList } = require("./getCategories");

// Reference: https://hoverbaum.net/2018/03/22/Wordpress-to-Contentful-migration/

const main = async () => {
  const apiUrl = "https://www.ayzenberg.com/wp-json/wp/v2";

  // Get posts from WP
  const posts = await exportBlogposts(`${apiUrl}/posts`);

  // Process posts
  const processedPosts = transformPosts(posts);

  // Get Categories fron WP
  const categories = await generateAssetsList(
    processedPosts,
    `${apiUrl}/categories`
  );

  // Create list of assets needed from WP

  // Create and publish assets in Contentful

  // Create and publish categories in Contentful

  // Create, link and publish posts
};

main();
