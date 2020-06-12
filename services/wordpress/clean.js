const { purgeAssets } = require("./contentfulClient");

const resetContentfulAssets = async () => {
  await purgeAssets();
};

resetContentfulAssets();
