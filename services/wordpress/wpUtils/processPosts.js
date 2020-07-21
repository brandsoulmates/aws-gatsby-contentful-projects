const { log, getUniqueImages } = require("../utils");
const Entities = require("html-entities").XmlEntities;
const entities = new Entities();

const extractBodyImages = (post) => {
  const regex = /<img.*?src="(.*?)"/g;
  const regexVideo = /<video.*?src="(.*?)"/g;
  post.bodyImages = [];
  post.videos = [];
  post.iframe = [];

  while ((foundImage = regexVideo.exec(post.body))) {
    post.body = post.body.replace(/(<video("[^"]*"|[^\/">])*)>/gi, "$1/>");
    post.body = post.body.replace(/<video/g, "<img");
  }

  while ((foundImage = regex.exec(post.body))) {
    post.body = post.body.replace(/(<img("[^"]*"|[^\/">])*)>/gi, "$1/>");
    const alt = foundImage[2] ? foundImage[2].replace(/_/g, " ") : "";
    post.bodyImages.push({
      link: foundImage[1],
      description: alt,
      title: alt,
      postId: post.id,
      type: "image",
    });
  }

  const uniqueImages =
    (post.bodyImages.length > 1 && getUniqueImages(post.bodyImages)) ||
    post.bodyImages;
  post.bodyImages = uniqueImages;

  if (post.heroImage) {
    post.bodyImages.push({
      link: `${post.heroImage}`,
      description: "",
      title: "",
      postId: "",
    });
  }

  return post;
};

exports.transformPosts = (posts) => {
  log("info", `Transforming Posts...`, true);

  const transformedPosts = posts.map(
    ({
      date_gmt,
      content,
      title,
      slug,
      categories,
      acf,
      featured_media,
      tags,
    }) => {
      return extractBodyImages({
        publishDate: date_gmt + "+00:00",
        body: `<div>${entities.decode(content.rendered)}</div>`,
        title: entities.decode(title.rendered),
        slug: slug,
        category: categories[0],
        heroImage: acf && acf.tile_image,
        featured_media: featured_media,
        tags,
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
