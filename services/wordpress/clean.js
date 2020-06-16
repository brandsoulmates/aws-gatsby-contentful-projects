const { deleteAssets } = require("./contentfulUtils");
const { deleteEntries } = require("./contentfulUtils/entries");

const resetContentfulAssets = async () => {
  // await deleteAssets();
  // await deleteEntries("Blog Category");
  await deleteEntries("4IpsfLbMr1vCB5zMKAE2Jb");
};

resetContentfulAssets();
