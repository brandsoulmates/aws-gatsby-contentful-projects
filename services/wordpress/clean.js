const {
  deleteAssets,
  deleteEntries,
  CONTENT_TYPES,
} = require("./contentfulUtils");
const { log } = require("./utils");
const yargs = require("yargs");

// Get Options
const argv = yargs
  .option("content-types", {
    alias: "c",
    description:
      "Specify the content type ids to delete. If not provided, defaults to blogPosts and blogCategories",
    type: "array",
  })
  .option("assets", {
    alias: "a",
    description: "Specifies whether or not to delete assets. Defaults to false",
    type: "boolean",
  })
  .help()
  .alias("help", "h").argv;

const defaultContentTypes = [CONTENT_TYPES.CATEGORY, CONTENT_TYPES.POST];

const deletAssetsAndEntries = async () => {
  const contentTypes = argv["content-types"] || defaultContentTypes;

  try {
    if (argv.a) await deleteAssets();

    for (const contentType of contentTypes) {
      await deleteEntries(contentType);
    }

    log("success", "Deletion complete", true);
  } catch (e) {
    log("error", "Deletion failed to complete", true);
    log("error", e);
  }
};

deletAssetsAndEntries();
