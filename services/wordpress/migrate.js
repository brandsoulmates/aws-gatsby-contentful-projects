const {
  exportBlogposts,
  getAssets,
  getCategories,
  transformPosts,
  exportTags,
} = require("./wpUtils");
const {
  createAndPublishAssets,
  createAndPublishEntries,
  CONTENT_TYPES,
} = require("./contentfulUtils");
const { log, writeToJson } = require("./utils");

// Migration Reference: https://hoverbaum.net/2018/03/22/Wordpress-to-Contentful-migration/
// Contentful Management Reference: https://contentful.github.io/contentful-management.js/contentful-management/5.26.5/globals.html
// Wordpress REST Api Reference: https://developer.wordpress.org/rest-api/reference/

const apiUrl = "https://www.ayzenberg.com/wp-json/wp/v2";

const migrateWP2Contentful = async () => {
  try {
    // Collect data from WP
    let posts = await exportBlogposts(`${apiUrl}/posts`);
    posts = posts.slice(0, 4);
    const tags = await exportTags(`${apiUrl}/tags`);
    const processedPosts = transformPosts(posts, tags);
    const assets = await getAssets(processedPosts, `${apiUrl}/media`);
    const categories = await getCategories(
      processedPosts,
      `${apiUrl}/categories`
    );

    // Migrate to Contentful
    const publishedAssets = await createAndPublishAssets(assets);
    const {
      publishedEntries: publishedCategories,
    } = await createAndPublishEntries(categories, CONTENT_TYPES.CATEGORY);
    const { publishedEntries: publishedTags } = await createAndPublishEntries(
      tags,
      CONTENT_TYPES.TAG
    );
    const { richTextLinkedEntries } = await createAndPublishEntries(
      processedPosts,
      CONTENT_TYPES.POST,
      {
        categories: publishedCategories,
        assets: publishedAssets,
        tags: publishedTags,
      }
    );

    // Export marked posts with rich text that has embedded assets with external links
    // Requires manual work on Contentful Site
    const postsWithRichTextLinkedEntries = {
      message: "Rich text has embedded assets with external links.",
      count: richTextLinkedEntries.length,
      entries: richTextLinkedEntries,
    };
    writeToJson("richtext", postsWithRichTextLinkedEntries);

    log("success", "Migration Complete", true);
  } catch (e) {
    log("error", "Migration Failed", true);
    log("error", e);
  }
};

migrateWP2Contentful();
