var https = require("https");

exports.exportBlogposts = (apiUrl, log = console.log) =>
  new Promise((resolve) => {
    const exportPageOfPosts = (apiUrl, page = 1, allPosts = []) => {
      log(`Getting posts for page ${page}`);
      const url = `${apiUrl}?page=${page}`;
      https
        .get(url, (res) => {
          if (res.statusCode === 400) {
            return resolve(allPosts);
          }
          let result = "";

          res.on("data", (d) => {
            result += d.toString();
          });

          res.on("end", async () => {
            blogPosts = JSON.parse(result);
            return exportPageOfPosts(
              apiUrl,
              page + 1,
              allPosts.concat(blogPosts)
            );
          });
        })
        .on("error", (e) => {
          throw Error("Error while exporting blogposts", e);
        });
    };
    exportPageOfPosts(apiUrl);
  });
