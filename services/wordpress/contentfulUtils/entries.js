const { getContentfulSpace, getContentfulEnvironment } = require("./client");
const { log } = require("../utils");

const checkForExistingContentType = async (contentType) => {
  try {
    log("progress", `checking for existing content type ${contentType}`);
    const environment = await getContentfulEnvironment();
    const allContentTypes = await environment.getContentTypes();
    const existingContentType =
      allContentTypes &&
      allContentTypes.items.filter(({ name }) => name === contentType);

    log("progress", `content type "${contentType}" already exists`);
    return existingContentType;
  } catch (e) {
    log("progress", `content type "${contentType}" does not currently exist`);
    return null;
  }
};

const createContentType = async (contentType) => {
  try {
    const environment = await getContentfulEnvironment();
    const existingContentType = await checkForExistingContentType(contentType);
    if (existingContentType.length) return existingContentType[0];

    log("progress", `creating content type "${contentType}"`);
    const createdContentType = await environment.createContentType({
      name: contentType,
      fields: [
        {
          id: "categoryName",
          name: "Category Name",
          type: "Symbol",
          localized: false,
          required: true,
          validations: [],
          disabled: false,
          omitted: false,
        },
      ],
    });

    return createdContentType.publish();
  } catch (e) {
    log("error", `Content Type "${contentType}" failed to create`);
    log("error", e);
  }
};

const createEntry = async (entry, contentType) => {
  try {
    const environment = await getContentfulEnvironment();
    const cmsCategory = await environment.createEntry(contentType.sys.id, {
      fields: {
        categoryName: {
          "en-US": entry.name,
        },
      },
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

exports.createAndPublishEntries = async (entries) => {
  log(
    "info",
    `Creating and publishing entries (categories) in Contentful`,
    true
  );
  const numEntries = entries.length;
  let numPublished = 0;
  const publishedEntries = [];
  const publishedContentType = await createContentType("Blog Category");

  const createAndPublishSingleEntry = async (entry) => {
    const cmsEntry = await createEntry(entry, publishedContentType);
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
