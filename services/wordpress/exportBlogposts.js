const { getJSON } = require("./utils");

const exportPageOfPosts = async (
  apiUrl,
  page = 1,
  allPosts = [],
  log = console.log
) => {
  log(`getting posts for page ${page}`);
  const url = `${apiUrl}?page=${page}`;
  const posts = await getJSON(url);
  return posts
    ? await exportPageOfPosts(apiUrl, page + 1, allPosts.concat(posts), log)
    : allPosts;
};

exports.exportBlogposts = async (apiUrl, log = console.log) => {
  const allPosts = await exportPageOfPosts(apiUrl, 1, [], log);
  return allPosts;
};
