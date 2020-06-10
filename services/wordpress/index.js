const Listr = require("listr");
const { Observable } = require("rxjs");

const { exportBlogposts } = require("./exportBlogposts");
const { transformPosts } = require("./processPosts");
const { getCategories } = require("./getCategories");
const { getAssets } = require("./getAssets");

// Reference: https://hoverbaum.net/2018/03/22/Wordpress-to-Contentful-migration/

const apiUrl = "https://www.ayzenberg.com/wp-json/wp/v2";

const tasks = new Listr([
  {
    title: `Get posts from api ${apiUrl}/posts`,
    task: (ctx) => {
      return new Observable(async (observer) => {
        ctx.posts = await exportBlogposts(`${apiUrl}/posts`, (val) =>
          observer.next(val)
        );
        observer.complete();
      });
    },
  },
  {
    title: "Process posts",
    task: (ctx) => {
      return new Observable((observer) => {
        ctx.processedPosts = transformPosts(ctx.posts);
        observer.complete();
      });
    },
  },
  {
    title: `Get unique categories at api ${apiUrl}/categories`,
    task: (ctx) => {
      return new Observable(async (observer) => {
        ctx.categories = await getCategories(
          ctx.processedPosts,
          `${apiUrl}/categories`,
          (val) => observer.next(val)
        );

        observer.complete();
      });
    },
  },
  {
    title: `Get unique assets at api ${apiUrl}/media`,
    task: (ctx) => {
      return new Observable(async (observer) => {
        ctx.assets = await getAssets(
          ctx.processedPosts,
          `${apiUrl}/media`,
          (val) => observer.next(val)
        );
        observer.complete();
      });
    },
  },
  {
    title: `Create and publish assets in Contentful`,
    task: () => {},
  },
  {
    title: `Create and publish categories in Contentful`,
    task: () => {},
  },
  {
    title: `Create, link and publish posts`,
    task: () => {},
  },
]);

tasks.run().catch((err) => {
  console.error(err);
});
