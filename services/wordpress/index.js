const { exportBlogposts } = require("./exportBlogposts");

const main = async () => {
  const apiUrl = "https://www.ayzenberg.com/wp-json/wp/v2/posts";

  // Get posts from WP
  const posts = await exportBlogposts(apiUrl);
  console.log(posts);

  // Process posts

  // Get Categories fron WP

  // Create list of assets needed from WP

  // Create and publish assets in Contentful

  // Create and publish categories in Contentful

  // Create, link and publish posts
};

main();
