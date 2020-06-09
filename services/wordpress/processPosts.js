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

exports.transformPosts = (posts) =>
  posts.map((post) => {
    delete post._links;
    delete post.guid;
    delete post.excerpt;
    delete post.author;
    delete post.comment_status;
    delete post.ping_status;
    delete post.template;
    delete post.format;
    delete post.meta;
    delete post.status;
    delete post.type;
    post.publishDate = post.date_gmt + "+00:00";
    delete post.date_gmt;
    delete post.date;
    delete post.modified;
    delete post.modified_gmt;
    delete post.tags;
    delete post.sticky;
    post.body = `<div>${post.content.rendered}</div>`;
    delete post.content;
    post.title = post.title.rendered;
    post.slug = post.slug;
    post.category = post.categories[0];
    delete post.categories;
    return extractBodyImages(post);
  });
