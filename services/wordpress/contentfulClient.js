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
    log(cmsAsset);
  } catch (e) {
    log(e);
    log(`Asset "${asset.title}" failed to create, retrying...`);
  }
};

const publishAsset = async () => {};

const createAndPublishSingleAsset = async (asset, log = console.log) => {
  createAsset(asset, log);

  return asset;
};

exports.createAndPublishAssets = async (assets, log = console.log) => {
  assets = assets.slice(0, 1);

  return await Promise.all(
    assets.map(async (asset) => {
      return await createAndPublishSingleAsset(asset, log);
    })
  );
};
