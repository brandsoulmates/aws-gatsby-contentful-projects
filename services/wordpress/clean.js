const { deleteAssets } = require("./contentfulUtils");
const { deleteEntries } = require("./contentfulUtils/entries");

const resetContentfulAssets = async () => {
  await deleteAssets();
  await deleteEntries("blogCategory");
  await deleteEntries("blogPost");
};

resetContentfulAssets();
