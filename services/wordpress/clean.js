const { deleteAssets } = require("./contentfulUtils");
const { deleteEntries } = require("./contentfulUtils/entries");

const deletAssetsAndEntries = async () => {
  await deleteAssets();
  await deleteEntries("blogCategory");
  await deleteEntries("blogPost");
};

deletAssetsAndEntries();
