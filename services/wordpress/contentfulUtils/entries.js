const { getContentfulEnvironment } = require("./client");
const {
  createContentType,
  getPopulatedEntryFields,
} = require("./contentTypes");
const { log } = require("../utils");

const createEntry = async (entry, contentType, contentTypeObj) => {
  try {
    const environment = await getContentfulEnvironment();
    const cmsCategory = await environment.createEntry(contentTypeObj.sys.id, {
      fields: getPopulatedEntryFields(entry, contentType),
    });
    return cmsCategory;
  } catch (e) {
    log("warning", `Entry "${entry.name}" failed to create, retrying...`);
    log("warning", e);
  }
};

const publishEntry = async (cmsEntry) => {
  try {
    const publishedCMSEntry = await cmsEntry.publish();

    return publishedCMSEntry;
  } catch (e) {
    log("warning", `Entry "${cmsEntry.title}" failed to publish, retrying...`);
    log("warning", e);
  }
};

exports.createAndPublishEntries = async (entries, contentType) => {
  log(
    "info",
    `Creating and publishing entries (categories) in Contentful`,
    true
  );
  const numEntries = entries.length;
  let numPublished = 0;
  const publishedEntries = [];
  const publishedContentType = await createContentType(contentType);

  const createAndPublishSingleEntry = async (entry) => {
    const cmsEntry = await createEntry(
      entry,
      contentType,
      publishedContentType
    );
    const publishedEntry = await publishEntry(cmsEntry);

    publishedEntry.wpEntry = entry;
    publishedEntries.push(publishedEntry);

    numPublished++;
    log("progress", `published ${numPublished} of ${numEntries}`);
    return publishedEntry;
  };

  await Promise.all(
    entries.map(async (entry) => {
      return await createAndPublishSingleEntry(entry);
    })
  );

  log("success", `Published ${numPublished} of ${numEntries} total entries`);
  return publishedEntries;
};

exports.deleteEntries = async () => {
  let total = 0;
  let sucessfullyDeleted = 0;

  log("info", `Deleting all entries from contentful`, true);

  log("success", `Deleted ${sucessfullyDeleted} of ${total} total entries`);
};
