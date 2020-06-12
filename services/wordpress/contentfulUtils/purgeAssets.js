const { getContentfulEnvironment } = require("./client.js");
const { async } = require("rxjs/internal/scheduler/async");

exports.purgeAssets = async () => {
  let total = 0;
  let sucessfullyDeleted = 0;

  console.log(`Purging all assets from contentful`);
  const purgeAssetsPerLimit = async (skip = 0) => {
    try {
      const env = await getContentfulEnvironment();
      const cmsAssets = await env.getAssets({ skip });
      if (!total) total = cmsAssets.total;

      await Promise.all(
        cmsAssets.items.map(async (asset) => {
          if (asset.isPublished()) await asset.unpublish();
          const res = await asset.delete();
          sucessfullyDeleted++;
          console.log(
            `...deleted ${sucessfullyDeleted} of ${total} total assets`
          );
          return res;
        })
      );

      const hasMoreItems = cmsAssets.skip + cmsAssets.items.length < total;
      if (hasMoreItems)
        await purgeAssetsPerLimit(cmsAssets.skip + cmsAssets.items.length);
    } catch (e) {
      console.log("Error deleting assets", e);
    }
  };
  await purgeAssetsPerLimit();
  console.log(
    `Successfully deleted ${sucessfullyDeleted} of ${total} total assets`
  );
};
