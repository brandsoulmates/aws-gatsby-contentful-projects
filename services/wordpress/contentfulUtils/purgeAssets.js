const { getContentfulEnvironment } = require("./client.js");

exports.purgeAssets = async () => {
  let total = 0;
  let sucessfullyDeleted = 0;

  console.log(`Purging all assets from contentful`);
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
          console.log(
            `...deleted ${sucessfullyDeleted} of ${total} total assets`
          );
          return asset;
        })
      );

      const hasMoreItems = cmsAssets.items.length < cmsAssets.total;
      if (hasMoreItems) await purgeAssetsPerLimit();
    } catch (e) {
      console.log("Error deleting assets", e);
    }
  };

  await purgeAssetsPerLimit();
  console.log(
    `Successfully deleted ${sucessfullyDeleted} of ${total} total assets`
  );
};
