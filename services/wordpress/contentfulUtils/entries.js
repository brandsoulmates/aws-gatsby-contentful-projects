const { getContentfulEnvironment } = require("./client");
const {
  createContentType,
  getPopulatedEntryFields,
  CONTENT_TYPES,
} = require("./contentTypes");
const { log } = require("../utils");
const { richTextFromMarkdown } = require("@contentful/rich-text-from-markdown");
const TurndownService = require("turndown");
const striptags = require("striptags");

const getContentfulAssetId = (link, linkIds) => {
  let replacedText = link;
  linkIds.forEach((id, url) => {
    if (url && id) {
      replacedText = replacedText.replace(url, id);
    }
  });
  return replacedText;
};

const sanitizeMd = (markdown) =>
  striptags(markdown)
    .split("\n\n")
    .map((text) =>
      text.match(new RegExp(/\[!\[/)) || text.match(new RegExp(/\_!\[/))
        ? text.slice(1)
        : text
    )
    .join("\n\n");

const createEntry = async (entry, contentType, linkingData) => {
  try {
    const environment = await getContentfulEnvironment();
    const getRichtext = async (entry) => {
      const turndownService = new TurndownService();
      const markdown = turndownService.turndown(entry.body);
      const sanitizedMd = sanitizeMd(markdown);
      const convertToRichText = await richTextFromMarkdown(
        sanitizedMd,
        async (mdNode) => {
          if (mdNode.type !== "image") {
            return null;
          }
          if (
            mdNode &&
            mdNode.url &&
            getContentfulAssetId(mdNode.url, linkingData.linkIds) !== mdNode.url
          ) {
            return {
              nodeType: "embedded-asset-block",
              content: [],
              data: {
                target: {
                  sys: {
                    type: "Link",
                    linkType: "Asset",
                    id: getContentfulAssetId(mdNode.url, linkingData.linkIds),
                  },
                },
              },
            };
          }
          return null;
        }
      );
      return convertToRichText;
    };
    const richtext = entry && entry.body && (await getRichtext(entry));
    const cmsCategory = await environment.createEntry(contentType.id, {
      fields: getPopulatedEntryFields(
        entry,
        contentType,
        linkingData,
        richtext
      ),
    });
    return cmsCategory;
  } catch (e) {
    log("warning", `Entry "${entry.name || entry.title}" failed to create`);
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
      `Entry "${cmsEntry.name || cmsEntry.title}" failed to publish`
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
  const linkIds = new Map();
  if (linkingData) {
    linkingData.assets.forEach((asset) => {
      linkIds.set(asset.wpAsset.link, asset.sys.id);
      linkMap.set(asset.wpAsset.link, asset.fields.file["en-US"].url);
    });
  }

  const createAndPublishSingleEntry = async (entry) => {
    const cmsEntry = await createEntry(entry, contentType, {
      linkMap,
      linkIds,
      ...linkingData,
    });
    const publishedEntry = await publishEntry(cmsEntry);

    publishedEntry.wpEntry = entry;
    publishedEntries.push(publishedEntry);

    numPublished++;
    log(
      "progress",
      `published ${contentType.name} ${numPublished} of ${numEntries}`
    );
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

  if (typeof contentType === "string") {
    contentType = { name: contentType, id: contentType };
  }

  log("info", `Deleting ${contentType.name} entries from contentful`, true);
  const deleteEntriesPerLimit = async () => {
    try {
      const env = await getContentfulEnvironment();
      const cmsEntries = await env.getEntries({ content_type: contentType.id });
      if (!total) total = cmsEntries.total;

      await Promise.all(
        cmsEntries.items.map(async (entry) => {
          if (entry.isPublished()) await entry.unpublish();
          await entry.delete();

          sucessfullyDeleted++;
          log(
            "progress",
            `deleted ${contentType.name} ${sucessfullyDeleted} of ${total} entries`
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
