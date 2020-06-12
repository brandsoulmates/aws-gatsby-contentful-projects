const Listr = require("listr");
const { Observable } = require("rxjs");

const { exportBlogposts } = require("./exportBlogposts");
const { transformPosts } = require("./processPosts");
const { getCategories } = require("./getCategories");
const { getAssets } = require("./getAssets");
const {
  getContentfulClient,
  createAndPublishAssets,
} = require("./contentfulClient");

// Reference: https://hoverbaum.net/2018/03/22/Wordpress-to-Contentful-migration/

const apiUrl = "https://www.ayzenberg.com/wp-json/wp/v2";

const main = async () => {
  console.log(`Get posts from api ${apiUrl}/posts`);
  const posts = await exportBlogposts(`${apiUrl}/posts`);

  console.log("Process posts");
  const processedPosts = transformPosts(posts);

  console.log(`Get unique categories at api ${apiUrl}/categories`);
  const categories = await getCategories(
    processedPosts,
    `${apiUrl}/categories`
  );

  console.log(`Get unique assets at api ${apiUrl}/media`);
  const assets = await getAssets(processedPosts, `${apiUrl}/media`);

  console.log(`Create and publish assets in Contentful`);
  const publishedAssets = await createAndPublishAssets(assets);

  console.log(publishedAssets.length);

  // console.log(`Create and publish categories in Contentful`);
  // console.log(`Create, link and publish posts`);
};

main();

// const tasks = new Listr([
//   {
//     title: `Get posts from api ${apiUrl}/posts`,
//     task: (ctx) => {
//       return new Observable(async (observer) => {
//         const posts = await exportBlogposts(`${apiUrl}/posts`, (val) =>
//           observer.next(val)
//         );

//         if (!posts.length) ctx.error = "No posts were found";
//         ctx.posts = posts;
//         observer.complete();
//       });
//     },
//   },
//   {
//     title: "Process posts",
//     task: (ctx) => {
//       if (ctx.error) return Promise.reject(new Error(ctx.error));
//       return new Observable((observer) => {
//         ctx.processedPosts = transformPosts(ctx.posts);
//         observer.complete();
//       });
//     },
//   },
//   {
//     title: `Get unique categories at api ${apiUrl}/categories`,
//     task: (ctx) => {
//       if (ctx.error) return Promise.reject(new Error(ctx.error));
//       return new Observable(async (observer) => {
//         const categories = await getCategories(
//           ctx.processedPosts,
//           `${apiUrl}/categories`,
//           (val) => observer.next(val)
//         );
//         if (!categories.length) ctx.error = "No categories were found";
//         ctx.categories = categories;
//         observer.complete();
//       });
//     },
//   },
//   {
//     title: `Get unique assets at api ${apiUrl}/media`,
//     task: (ctx) => {
//       if (ctx.error) return Promise.reject(new Error(ctx.error));
//       return new Observable(async (observer) => {
//         const assets = await getAssets(
//           ctx.processedPosts,
//           `${apiUrl}/media`,
//           (val) => observer.next(val)
//         );
//         if (!assets.length) ctx.error = "No assets were found";
//         ctx.assets = assets;
//         observer.complete();
//       });
//     },
//   },
//   {
//     title: `Create and publish assets in Contentful`,
//     task: (ctx) => {
//       if (ctx.error) return Promise.reject(new Error(ctx.error));
//       return new Observable((observer) => {
//         observer.next("Getting space");

//       });
//     },
//   },
//   {
//     title: `Create and publish categories in Contentful`,
//     task: (ctx) => {
//       if (ctx.error) return Promise.reject(new Error(ctx.error));
//     },
//   },
//   {
//     title: `Create, link and publish posts`,
//     task: (ctx) => {
//       if (ctx.error) return Promise.reject(new Error(ctx.error));
//     },
//   },
//   {
//     title: `Success`,
//     task: (ctx, task) => {
//       if (ctx.error) {
//         task.title = "Failure";
//         return Promise.reject(new Error(ctx.error));
//       }
//     },
//   },
// ]);

// tasks.run().catch((err) => {
//   console.error(err);
// });
