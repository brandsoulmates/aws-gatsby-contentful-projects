const { getContentfulEnvironment } = require("./client");
const { log } = require("../utils");

const locale = "en-US";

const getAssetFileName = (asset) => {
  const parsedLink = asset.link.split("/");
  return asset.title
    ? `${asset.title.toLowerCase().replace(/\s/g, "-")}.jpg`
    : parsedLink[parsedLink.length - 1];
};

const createAsset = async (asset) => {
  try {
    const env = await getContentfulEnvironment();
    const cmsAsset = await env.createAsset({
      fields: {
        title: {
          [locale]: getAssetFileName(asset).split(".")[0],
        },
        description: {
          [locale]: asset.description,
        },
        file: {
          [locale]: {
            contentType: "image/jpeg",
            fileName: getAssetFileName(asset),
            upload: encodeURI(asset.link),
          },
        },
      },
    });
    return cmsAsset;
  } catch (e) {
    log("warning", `Asset "${asset.title}" failed to create`);
    log("error", e);
  }
};

const publishAsset = async (cmsAsset) => {
  try {
    const processedCMSAsset = await cmsAsset.processForAllLocales();
    const publishedCMSAsset = await processedCMSAsset.publish();

    return publishedCMSAsset;
  } catch (e) {
    log("warning", `Asset "${asset.title}" failed to publish`);
    log("error", e);
  }
};

exports.createAndPublishAssets = async (assets) => {
  log("info", `Creating and publishing assets in Contentful`, true);
  const numAssets = assets.length;
  let numPublished = 0;
  const publishedAssets = [];

  const createAndPublishSingleAsset = async (asset) => {
    const cmsAsset = await createAsset(asset);
    const publishedAsset = await publishAsset(cmsAsset);

    publishedAsset.wpAsset = asset;
    publishedAssets.push(publishedAsset);

    numPublished++;
    log("progress", `published asset ${numPublished} of ${numAssets}`);
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

exports.deleteAssets = async () => {
  let total = 0;
  let sucessfullyDeleted = 0;

  log("info", `Deleting all assets from contentful`, true);
  const deleteAssetsPerLimit = async () => {
    try {
      const env = await getContentfulEnvironment();
      const cmsAssets = await env.getAssets();
      if (!total) total = cmsAssets.total;

      await Promise.all(
        cmsAssets.items.map(async (asset) => {
          if (asset.isPublished()) await asset.unpublish();
          await asset.delete();

          sucessfullyDeleted++;
          log("progress", `deleted ${sucessfullyDeleted} of ${total} assets`);
          return asset;
        })
      );

      const hasMoreItems = cmsAssets.items.length < cmsAssets.total;
      if (hasMoreItems) await deleteAssetsPerLimit();
    } catch (e) {
      log("error", `Unable to complete deletion of all assets`);
      log("error", e);
    }
  };

  await deleteAssetsPerLimit();
  log("success", `Deleted ${sucessfullyDeleted} of ${total} total assets`);
};
