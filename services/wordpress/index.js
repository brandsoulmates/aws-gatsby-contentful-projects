const {
  exportBlogposts,
  getAssets,
  getCategories,
  transformPosts,
} = require("./wpUtils");
const {
  createAndPublishAssets,
  createAndPublishEntries,
  CONTENT_TYPES,
} = require("./contentfulUtils");
const { log } = require("./utils");

// Migration Reference: https://hoverbaum.net/2018/03/22/Wordpress-to-Contentful-migration/
// Contentful Management Reference: https://contentful.github.io/contentful-management.js/contentful-management/5.26.5/globals.html

const apiUrl = "https://www.ayzenberg.com/wp-json/wp/v2";

const migrateWP2Contentful = async () => {
  try {
    // Collect data from WP
    const posts = await exportBlogposts(`${apiUrl}/posts`);
    const processedPosts = transformPosts(posts);
    const categories = await getCategories(
      processedPosts,
      `${apiUrl}/categories`
    );
    const assets = await getAssets(processedPosts, `${apiUrl}/media`);

    // Migrate to Contentful
    const publishedCategories = await createAndPublishEntries(
      categories,
      CONTENT_TYPES.CATEGORY
    );
    const publishedAssets = await createAndPublishAssets(assets);
    await createAndPublishEntries(processedPosts, CONTENT_TYPES.POST, {
      categories: publishedCategories,
      assets: publishedAssets,
    });

    log("success", "Migration Complete", true);
  } catch (e) {
    log("error", "Migration Failed", true);
    log("error", e);
  }
};

migrateWP2Contentful();
