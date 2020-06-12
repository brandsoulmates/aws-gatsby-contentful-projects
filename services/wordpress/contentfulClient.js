const contentful = require("contentful-management");
require("dotenv").config({
  path: `.env`,
});

// Contentful Config
const locale = "en-US";
const spaceID = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_MANAGEMENT_API;
const environment = process.env.CONTENTFUL_ENVIRONMENT;

const client = contentful.createClient({
  accessToken,
  // logHandler: (level, data) => console.log(`${level} | ${data}`),
});

exports.getContentfulClient = () => client;
const getContentfulSpace = async () => await client.getSpace(spaceID);

const createAsset = async (asset, log = console.log) => {
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
            fileName: `${asset.title.toLowerCase().replace(/\s/g, "-")}.jpg`,
            upload: encodeURI(asset.link),
          },
        },
      },
    });
    return cmsAsset;
  } catch (e) {
    log(`Asset "${asset.title}" failed to create, retrying...`);
  }
};

const publishAsset = async (cmsAsset, log = console.log) => {
  try {
    const processedCMSAsset = await cmsAsset.processForAllLocales();
    const publishedCMSAsset = await processedCMSAsset.publish();

    return publishedCMSAsset;
  } catch (e) {
    log(`Asset "${asset.title}" failed to publish, retrying...`);
  }
};

exports.createAndPublishAssets = async (assets, log = console.log) => {
  // assets = assets.slice(0, 25);
  const numAssets = assets.length;
  let numPublished = 0;

  const createAndPublishSingleAsset = async (asset, log = console.log) => {
    const cmsAsset = await createAsset(asset, log);
    const publishedAsset = await publishAsset(cmsAsset, log);

    numPublished++;
    console.log(`published ${numPublished} of ${numAssets}`);
    return publishedAsset;
  };

  return await Promise.all(
    assets.map(async (asset, i, array) => {
      return await createAndPublishSingleAsset(asset, log);
    })
  );
};
