const { getContentfulSpace, getContentfulEnvironment } = require("./client");
const { log } = require("../utils");

const locale = "en-US";

const blogCategoryFields = [
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
];

const blogPostFields = [
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
];

exports.CONTENT_TYPES = {
  CATEGORY: { name: "Blog Category", fields: blogCategoryFields },
  POST: { name: "Blog Post", fields: blogPostFields },
};

const getPopulatedBlogCategoryFields = (entry) => ({
  categoryName: {
    [locale]: entry.name,
  },
});

const getPopulatedBlogPostFields = (entry) => ({
  categoryName: {
    [locale]: entry.name,
  },
});

exports.getPopulatedEntryFields = (entry, contentType) => {
  switch (contentType) {
    case this.CONTENT_TYPES.CATEGORY:
      return getPopulatedBlogCategoryFields(entry);
    case this.CONTENT_TYPES.POST:
      return getPopulatedBlogPostFields(entry);
    default:
      return null;
  }
};

const checkForExistingContentType = async (contentType) => {
  const contentTypeName = contentType.name;
  try {
    log("progress", `checking for existing content type ${contentTypeName}`);
    const environment = await getContentfulEnvironment();
    const allContentTypes = await environment.getContentTypes();
    const existingContentType =
      allContentTypes &&
      allContentTypes.items.filter(({ name }) => name === contentTypeName);

    log("progress", `content type "${contentTypeName}" already exists`);
    return existingContentType;
  } catch (e) {
    log(
      "progress",
      `content type "${contentTypeName}" does not currently exist`
    );
    return null;
  }
};

exports.createContentType = async (contentType) => {
  const contentTypeName = contentType.name;
  try {
    const environment = await getContentfulEnvironment();
    const existingContentType = await checkForExistingContentType(contentType);
    if (existingContentType.length) return existingContentType[0];

    log("progress", `creating content type "${contentType}"`);
    const createdContentType = await environment.createContentType({
      name: contentTypeName,
      fields: blogCategoryFields,
    });

    return createdContentType.publish();
  } catch (e) {
    log("error", `Content Type "${contentTypeName}" failed to create`);
    log("error", e);
  }
};
