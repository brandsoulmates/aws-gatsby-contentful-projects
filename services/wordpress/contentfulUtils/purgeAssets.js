const { getContentfulEnvironment } = require("./client.js");
const { log } = require("../utils");

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
