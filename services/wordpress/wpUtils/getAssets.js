const { getJSON, log } = require("../utils");

exports.getAssets = async (posts, apiUrl) => {
  let assetsFetched = 0;

  log("info", `Getting unique featured_media images from api ${apiUrl}`, true);
  const featuredAssets = await Promise.all(
    posts
      .reduce((all, post) => {
        if (!post.featured_media) return all;
        return all.concat([
          {
            mediaNumber: post.featured_media,
            postId: post.id,
          },
        ]);
      }, [])
      .map(async ({ mediaNumber, postId }, i, array) => {
        const featuredMedia = await getJSON(`${apiUrl}/${mediaNumber}`);
        assetsFetched += 1;
        log(
          "progress",
          `getting data for asset ${assetsFetched}/${array.length}`
        );
        return {
          mediaNumber,
          link: featuredMedia.guid.rendered,
          title: featuredMedia.title.rendered || `asset${i}`,
          description: featuredMedia.alt_text || "",
          postId,
        };
      })
  );

  log("progress", "parsing images from body of posts");
  const bodyImages = posts.reduce((all, post) => {
    const images = post.bodyImages ? post.bodyImages : [];
    return all.concat(images);
  }, []);
  const assets = featuredAssets.concat(bodyImages);
  log("progress", `added ${bodyImages.length} images from body of posts`);

  if (!assets.length) log("warning", "No assets were found");
  else log("success", `Total Assets retrieved: ${assets.length}`);

  return assets;
};
