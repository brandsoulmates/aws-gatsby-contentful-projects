const { purgeAssets } = require("./contentfulUtils");

const resetContentfulAssets = async () => {
  await purgeAssets();
};

resetContentfulAssets();
