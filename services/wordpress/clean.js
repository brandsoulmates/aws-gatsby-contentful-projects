const {
  deleteAssets,
  deleteEntries,
  CONTENT_TYPES,
} = require("./contentfulUtils");
const { log } = require("./utils");

const deletAssetsAndEntries = async () => {
  try {
    await deleteAssets();
    await deleteEntries(CONTENT_TYPES.CATEGORY.id);
    await deleteEntries(CONTENT_TYPES.POST.id);
    log("success", "Deletion complete", true);
  } catch (e) {
    log("error", "Deletion failed to complete", true);
    log("error", e);
  }
};

deletAssetsAndEntries();
