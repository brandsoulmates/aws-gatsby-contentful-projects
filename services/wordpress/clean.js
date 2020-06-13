const { deleteAssets } = require("./contentfulUtils");

const resetContentfulAssets = async () => {
  await deleteAssets();
};

resetContentfulAssets();
