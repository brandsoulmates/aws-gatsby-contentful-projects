const { getJSON, log } = require("../utils");

const exportPageOfPosts = async (apiUrl, page = 1, allPosts = []) => {
  log("progress", `getting posts for page ${page}`);
  const url = `${apiUrl}?page=${page}`;
  const posts = await getJSON(url);
  return posts
    ? await exportPageOfPosts(apiUrl, page + 1, allPosts.concat(posts))
    : allPosts;
};

exports.exportBlogposts = async (apiUrl) => {
  log("info", `Getting posts from api ${apiUrl}`, true);
  const allPosts = await exportPageOfPosts(apiUrl);

  if (!allPosts.length)
    log(
      "error",
      `${chalk.red("Error")}: Unable to retrieve posts for ${apiUrl}\n`
    );
  else log("success", `Retrieved ${allPosts.length} posts`);

  return allPosts;
};
