const { getJSON, log } = require("../utils");

const getFeaturedMediaAssets = async (posts, apiUrl) => {
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
          `getting data for asset ${assetsFetched} of ${array.length}`
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
  return featuredAssets;
};

const parseBodyImages = (posts, featuredAssets) => {
  log("progress", "parsing images from body of posts");
  const bodyImages = posts.reduce((all, post) => {
    const images = post.bodyImages ? post.bodyImages : [];
    return all.concat(images);
  }, []);

  const assets = featuredAssets.concat(bodyImages);
  log("progress", `added ${bodyImages.length} images from body of posts`);
  return assets;
};

const filterAssets = (assets) => {
  log("progress", `filtering for unique assets`);
  const imageMap = {};
  const dupMap = {};
  assets.forEach((asset) => {
    if (!imageMap[asset.link]) {
      imageMap[asset.link] = asset;
    } else {
      dupMap[asset.link] = asset;
    }
  });
  const uniqueAssets = Object.values(imageMap);

  log(
    "progress",
    `reduced number of assets from ${assets.length} to ${uniqueAssets.length}`
  );

  log(
    "progress",
    `removed the following duplicate assets:\n\t${Object.keys(dupMap).join(
      "\n\t"
    )}`
  );
  return uniqueAssets;
};

exports.getAssets = async (posts, apiUrl) => {
  const featuredAssets = await getFeaturedMediaAssets(posts, apiUrl);
  const assets = parseBodyImages(posts, featuredAssets);
  const uniqueAssets = filterAssets(assets);

  if (!uniqueAssets.length) log("warning", "No assets were found");
  else log("success", `Total Assets retrieved: ${uniqueAssets.length}`);

  return uniqueAssets;
};
