const { getContentfulSpace, getContentfulEnvironment } = require("./client");
const { log } = require("../utils");

const locale = "en-US";

const createAsset = async (asset) => {
  try {
    const space = await getContentfulSpace();
    const cmsAsset = await space.createAsset({
      fields: {
        title: {
          [locale]: asset.title,
        },
        description: {
          [locale]: asset.description,
        },
        file: {
          [locale]: {
            contentType: "image/jpeg",
            fileName: `${asset.title.toLowerCase().replace(/\s/g, "-")}-${
              asset.mediaNumber
            }.jpg`,
            upload: encodeURI(asset.link),
          },
        },
      },
    });
    return cmsAsset;
  } catch (e) {
    log("warning", `Asset "${asset.title}" failed to create, retrying...`);
  }
};

const publishAsset = async (cmsAsset) => {
  try {
    const processedCMSAsset = await cmsAsset.processForAllLocales();
    const publishedCMSAsset = await processedCMSAsset.publish();

    return publishedCMSAsset;
  } catch (e) {
    log("warning", `Asset "${asset.title}" failed to publish, retrying...`);
  }
};

exports.createAndPublishAssets = async (assets) => {
  log("info", `Creating and publishing assets in Contentful`, true);
  // assets = assets.slice(0, 25);
  const numAssets = assets.length;
  let numPublished = 0;
  const publishedAssets = [];

  const createAndPublishSingleAsset = async (asset) => {
    const cmsAsset = await createAsset(asset);
    const publishedAsset = await publishAsset(cmsAsset);

    publishedAsset.wpAsset = asset;
    publishedAssets.push(publishedAsset);

    numPublished++;
    log("progress", `published ${numPublished} of ${numAssets}`);
    return publishedAsset;
  };

  await Promise.all(
    assets.map(async (asset) => {
      return await createAndPublishSingleAsset(asset);
    })
  );

  log("success", `Published ${numPublished} of ${numAssets} total assets`);
  return publishedAssets;
};

exports.purgeAssets = async () => {
  let total = 0;
  let sucessfullyDeleted = 0;

  log("info", `Purging all assets from contentful`, true);
  const purgeAssetsPerLimit = async (skip = 0) => {
    try {
      const env = await getContentfulEnvironment();
      const cmsAssets = await env.getAssets();
      if (!total) total = cmsAssets.total;

      await Promise.all(
        cmsAssets.items.map(async (asset) => {
          if (asset.isPublished()) await asset.unpublish();
          await asset.delete();

          sucessfullyDeleted++;
          log(
            "progress",
            `deleted ${sucessfullyDeleted} of ${total} total assets`
          );
          return asset;
        })
      );

      const hasMoreItems = cmsAssets.items.length < cmsAssets.total;
      if (hasMoreItems) await purgeAssetsPerLimit();
    } catch (e) {
      log("error", `Unable to complete deletion of all assets`);
      log("error", e);
    }
  };

  await purgeAssetsPerLimit();
  log("success", `Deleted ${sucessfullyDeleted} of ${total} total assets`);
};
