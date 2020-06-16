const { getContentfulEnvironment } = require("./client");
const {
  createContentType,
  getPopulatedEntryFields,
  CONTENT_TYPES,
} = require("./contentTypes");
const { log } = require("../utils");

const createEntry = async (entry, contentType) => {
  try {
    const environment = await getContentfulEnvironment();
    const cmsCategory = await environment.createEntry(contentType.id, {
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

const createAndPublishCategoryEntries = async (entries, contentType) => {
  log("info", `Creating and publishing entries (category) in Contentful`, true);
  const numEntries = entries.length;
  let numPublished = 0;
  const publishedEntries = [];
  await createContentType(contentType);

  const createAndPublishSingleEntry = async (entry) => {
    const cmsEntry = await createEntry(entry, contentType);
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

const createAndPublishPostEntries = async (entries, contentType) => {
  log("info", `Creating and publishing entries (post) in Contentful`, true);
  const numEntries = entries.length;
  let numPublished = 0;
  const publishedEntries = [];
  await createContentType(contentType);

  // const createAndPublishSingleEntry = async (entry) => {
  //   const cmsEntry = await createEntry(entry, contentType);
  //   const publishedEntry = await publishEntry(cmsEntry);

  //   publishedEntry.wpEntry = entry;
  //   publishedEntries.push(publishedEntry);

  //   numPublished++;
  //   log("progress", `published ${numPublished} of ${numEntries}`);
  //   return publishedEntry;
  // };

  // await Promise.all(
  //   entries.map(async (entry) => {
  //     return await createAndPublishSingleEntry(entry);
  //   })
  // );

  // log("success", `Published ${numPublished} of ${numEntries} total entries`);
  // return publishedEntries;
};

exports.createAndPublishEntries = async (entries, contentType, linkingData) => {
  switch (contentType) {
    case CONTENT_TYPES.CATEGORY:
      return createAndPublishCategoryEntries(entries, contentType);
    case CONTENT_TYPES.POST:
      return createAndPublishPostEntries(entries, contentType, linkingData);
    default:
      return null;
  }
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
          log(
            "progress",
            `deleted ${sucessfullyDeleted} of ${total} total entries`
          );
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
