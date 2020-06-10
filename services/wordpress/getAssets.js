const { getJSON } = require("./utils");

exports.getAssets = async (posts, apiURL) => {
  console.log(`\nGetting unique assets at api ${apiURL}`);
  let infosFetched = 0;

  // First add the featured_media images and get ther URLs.
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
        const featuredMedia = await getJSON(`${apiURL}/${mediaNumber}`);
        infosFetched += 1;
        console.log(
          `...getting info for asset ${infosFetched}/${array.length}`
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

  // After all this we also add images from the body of posts.
  console.log("...adding images from body of posts");
  const assets = featuredAssets.concat(
    posts.reduce((all, post) => {
      const images = post.bodyImages ? post.bodyImages : [];
      return all.concat(images);
    }, [])
  );

  console.log(`Successfully retrieved ${assets.length} assets.`);
  return assets;
};
