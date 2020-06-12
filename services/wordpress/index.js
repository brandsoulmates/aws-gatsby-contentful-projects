const {
  exportBlogposts,
  getAssets,
  getCategories,
  transformPosts,
} = require("./wpUtils");
const { createAndPublishAssets } = require("./contentfulUtils");

// Reference: https://hoverbaum.net/2018/03/22/Wordpress-to-Contentful-migration/

const apiUrl = "https://www.ayzenberg.com/wp-json/wp/v2";

const migrateWP2Contentful = async () => {
  const posts = await exportBlogposts(`${apiUrl}/posts`);
  const processedPosts = transformPosts(posts);
  const categories = await getCategories(
    processedPosts,
    `${apiUrl}/categories`
  );
  const assets = await getAssets(processedPosts, `${apiUrl}/media`);
  const publishedAssets = await createAndPublishAssets(assets);

  // console.log(publishedAssets.length);

  // console.log(`Create and publish categories in Contentful`);
  // console.log(`Create, link and publish posts`);
};

migrateWP2Contentful();
