const { getJSON } = require("./utils");

const exportPageOfPosts = async (apiUrl, page = 1, allPosts = []) => {
  console.log(`...getting posts for page ${page}`);
  const url = `${apiUrl}?page=${page}`;
  const posts = await getJSON(url);
  return posts
    ? await exportPageOfPosts(apiUrl, page + 1, allPosts.concat(posts))
    : allPosts;
};

exports.exportBlogposts = async (apiUrl) => {
  console.log(`Getting posts at api ${apiUrl}`);
  const allPosts = await exportPageOfPosts(apiUrl);
  if (!allPosts.length) {
    console.error(`Error: Unable to retrieve posts for ${apiUrl}\n`);
  } else {
    console.log(`Successfully retrieved ${allPosts.length} posts.`);
  }
  return allPosts;
};
