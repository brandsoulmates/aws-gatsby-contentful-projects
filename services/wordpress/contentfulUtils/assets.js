const { getContentfulSpace } = require("./client");

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
    console.log(e);
    console.log(`Asset "${asset.title}" failed to create, retrying...`);
  }
};

const publishAsset = async (cmsAsset) => {
  try {
    const processedCMSAsset = await cmsAsset.processForAllLocales();
    const publishedCMSAsset = await processedCMSAsset.publish();

    return publishedCMSAsset;
  } catch (e) {
    console.log(`Asset "${asset.title}" failed to publish, retrying...`);
  }
};

exports.createAndPublishAssets = async (assets) => {
  console.log(`\nCreating and publishing assets in Contentful`);
  // assets = assets.slice(0, 25);
  const numAssets = assets.length;
  let numPublished = 0;

  const createAndPublishSingleAsset = async (asset) => {
    const cmsAsset = await createAsset(asset);
    const publishedAsset = await publishAsset(cmsAsset);

    numPublished++;
    console.log(`...published ${numPublished} of ${numAssets}`);
    return publishedAsset;
  };

  const publishedAssets = await Promise.all(
    assets.map(async (asset, i, array) => {
      return await createAndPublishSingleAsset(asset);
    })
  );

  console.log(
    `Successfully published ${numPublished} of ${numAssets} total assets`
  );
  return publishedAssets;
};
