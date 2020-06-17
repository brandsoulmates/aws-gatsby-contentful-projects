const { deleteAssets, deleteEntries } = require("./contentfulUtils");
const { log } = require("./utils");

const deletAssetsAndEntries = async () => {
  try {
    await deleteAssets();
    await deleteEntries("blogCategory");
    await deleteEntries("blogPost");
    log("success", "Deletion complete", true);
  } catch (e) {
    log("error", "Deletion failed to complete", true);
    log("error", e);
  }
};

deletAssetsAndEntries();
