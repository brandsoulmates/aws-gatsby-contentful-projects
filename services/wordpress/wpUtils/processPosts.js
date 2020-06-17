const { log } = require("../utils");

const extractBodyImages = (post) => {
  const regex = /<img.*?src="(.*?)"[\s\S]*?alt="(.*?)"/g;
  post.bodyImages = [];
  while ((foundImage = regex.exec(post.body))) {
    const alt = foundImage[2] ? foundImage[2].replace(/_/g, " ") : "";
    post.bodyImages.push({
      link: foundImage[1],
      description: alt,
      title: alt,
      postId: post.id,
    });
  }
  return post;
};

exports.transformPosts = (posts) => {
  log("info", `Transforming Posts...`, true);
  const transformedPosts = posts.map(
    ({ date_gmt, content, title, slug, categories, ...rest }) => {
      return extractBodyImages({
        publishDate: date_gmt + "+00:00",
        body: `<div>${content.rendered}</div>`,
        title: title.rendered,
        slug: slug,
        category: categories[0],
        ...rest,
      });
    }
  );

  if (!transformedPosts.length) {
    log("warning", `No posts were transformed`);
  } else {
    log(
      "success",
      `Transformed ${transformedPosts.length} of ${posts.length} total posts`
    );
  }

  return transformedPosts;
};
