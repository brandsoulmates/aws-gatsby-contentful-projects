const { getContentfulEnvironment } = require("./client");
const {
  createContentType,
  getPopulatedEntryFields,
  CONTENT_TYPES,
} = require("./contentTypes");
const { log } = require("../utils");
const { link } = require("fs");

const createEntry = async (entry, contentType, linkingData) => {
  try {
    const environment = await getContentfulEnvironment();
    const cmsCategory = await environment.createEntry(contentType.id, {
      fields: getPopulatedEntryFields(entry, contentType, linkingData),
    });
    return cmsCategory;
  } catch (e) {
    log(
      "warning",
      `Entry "${entry.name || entry.title}" failed to create, retrying...`
    );
    log("warning", e);
  }
};

const publishEntry = async (cmsEntry) => {
  try {
    const publishedCMSEntry = await cmsEntry.publish();

    return publishedCMSEntry;
  } catch (e) {
    log(
      "warning",
      `Entry "${
        cmsEntry.name || cmsEntry.title
      }" failed to publish, retrying...`
    );
    log("warning", e);
  }
};

exports.createAndPublishEntries = async (entries, contentType, linkingData) => {
  log(
    "info",
    `Creating and publishing ${contentType.name} entries in Contentful`,
    true
  );
  const numEntries = entries.length;
  let numPublished = 0;
  const publishedEntries = [];
  await createContentType(contentType);

  const linkMap = new Map();
  if (linkingData) {
    linkingData.assets.forEach((asset) =>
      linkMap.set(asset.wpAsset.link, asset.fields.file["en-US"].url)
    );
  }

  const createAndPublishSingleEntry = async (entry) => {
    const cmsEntry = await createEntry(entry, contentType, {
      linkMap,
      ...linkingData,
    });
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

exports.deleteEntries = async (contentType) => {
  let total = 0;
  let sucessfullyDeleted = 0;

  log("info", `Deleting ${contentType} entries from contentful`, true);
  const deleteEntriesPerLimit = async () => {
    try {
      const env = await getContentfulEnvironment();
      const cmsEntries = await env.getEntries({ content_type: contentType });
      if (!total) total = cmsEntries.total;

      await Promise.all(
        cmsEntries.items.map(async (entry) => {
          if (entry.isPublished()) await entry.unpublish();
          await entry.delete();

          sucessfullyDeleted++;
          log("progress", `deleted ${sucessfullyDeleted} of ${total} entries`);
          return entry;
        })
      );

      const hasMoreItems = cmsEntries.items.length < cmsEntries.total;
      if (hasMoreItems) await deleteEntriesPerLimit();
    } catch (e) {
      log("error", `Unable to complete deletion of all entries`);
      log("error", e);
    }
  };

  await deleteEntriesPerLimit();

  log("success", `Deleted ${sucessfullyDeleted} of ${total} total entries`);
};
