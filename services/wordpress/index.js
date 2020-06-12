const Listr = require("listr");
const { Observable } = require("rxjs");

const { exportBlogposts } = require("./exportBlogposts");
const { transformPosts } = require("./processPosts");
const { getCategories } = require("./getCategories");
const { getAssets } = require("./getAssets");
const {
  getContentfulClient,
  createAndPublishAssets,
  purgeAssets,
} = require("./contentfulClient");

// Reference: https://hoverbaum.net/2018/03/22/Wordpress-to-Contentful-migration/

const apiUrl = "https://www.ayzenberg.com/wp-json/wp/v2";

const main = async () => {
  const posts = await exportBlogposts(`${apiUrl}/posts`);
  const processedPosts = transformPosts(posts);
  const categories = await getCategories(
    processedPosts,
    `${apiUrl}/categories`
  );
  const assets = await getAssets(processedPosts, `${apiUrl}/media`);
  // console.log(assets.slice(0, 10));

  // console.log(`Create and publish assets in Contentful`);
  // const publishedAssets = await createAndPublishAssets(assets);

  // console.log(publishedAssets.length);

  // console.log(`Create and publish categories in Contentful`);
  // console.log(`Create, link and publish posts`);
};

main();
