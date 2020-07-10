const { log } = require("../utils");
const Entities = require("html-entities").XmlEntities;
const entities = new Entities();

const extractBodyImages = (post) => {
  const regex = /<img.*?src="(.*?)"/g;
  post.bodyImages = [];

  while ((foundImage = regex.exec(post.body))) {
    post.body = post.body.replace(/(<img("[^"]*"|[^\/">])*)>/gi, "$1/>");
    const alt = foundImage[2] ? foundImage[2].replace(/_/g, " ") : "";
    post.bodyImages.push({
      link: foundImage[1],
      description: alt,
      title: alt,
      postId: post.id,
    });
  }
  // const bi = [];
  // const uniqImages =
  //   post.bodyImages.length > 1 &&
  //   post.bodyImages.filter((image) => {
  //     if (bi.length === 0) {
  //       bi.push(image);
  //       return image;
  //     }
  //     const uniq = bi.find((b) => b.link === image.link);
  //     if (!uniq) return image;
  //   });
  // post.bodyImages = uniqImages || post.bodyImages;
  // console.log("arr", post.bodyImages);
  return post;
};

exports.transformPosts = (posts) => {
  log("info", `Transforming Posts...`, true);
  const transformedPosts = posts.map(
    ({ date_gmt, content, title, slug, categories }) => {
      return extractBodyImages({
        publishDate: date_gmt + "+00:00",
        body: `<div>${entities.decode(content.rendered)}</div>`,
        title: entities.decode(title.rendered),
        slug: slug,
        category: categories[0],
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
