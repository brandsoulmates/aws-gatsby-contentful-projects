const { getContentfulEnvironment } = require("./client");
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
    id: "title",
    name: "Title",
    type: "Symbol",
    localized: false,
    required: true,
    validations: [],
    disabled: false,
    omitted: false,
  },
  {
    id: "body",
    name: "Body",
    type: "Text",
    localized: false,
    required: false,
    validations: [],
    disabled: false,
    omitted: false,
  },
  {
    id: "slug",
    name: "Slug",
    type: "Symbol",
    localized: false,
    required: false,
    validations: [],
    disabled: false,
    omitted: false,
  },
  {
    id: "publishDate",
    name: "Publish Date",
    type: "Date",
    localized: false,
    required: false,
    validations: [],
    disabled: false,
    omitted: false,
  },
  {
    id: "heroImage",
    name: "Hero Image",
    type: "Link",
    localized: false,
    required: false,
    validations: [],
    disabled: false,
    omitted: false,
    linkType: "Asset",
  },
  {
    id: "category",
    name: "Category",
    type: "Link",
    localized: false,
    required: false,
    validations: [],
    disabled: false,
    omitted: false,
    linkType: "Entry",
  },
  {
    id: "articleBody",
    name: "Article Body",
    type: "RichText",
    localized: false,
    required: false,
    validations: [
      {
        nodes: {},
      },
      {
        enabledNodeTypes: [
          "heading-1",
          "heading-2",
          "heading-3",
          "heading-4",
          "heading-5",
          "heading-6",
          "ordered-list",
          "unordered-list",
          "hr",
          "blockquote",
          "embedded-asset-block",
          "hyperlink",
          "entry-hyperlink",
          "asset-hyperlink",
          "break",
          "text",
        ],
        message:
          "Only heading 1, heading 2, heading 3, heading 4, heading 5, heading 6, ordered list, unordered list, horizontal rule, quote, asset, link to Url, link to entry, and link to asset nodes are allowed",
      },
    ],
    disabled: false,
    omitted: false,
  },
];

exports.CONTENT_TYPES = {
  CATEGORY: {
    id: "blogCategory",
    name: "Blog Category",
    fields: blogCategoryFields,
  },
  POST: { id: "blogPost", name: "Blog Post", fields: blogPostFields },
};

const replaceWPWithContentfulLinks = (text, linkMap) => {
  let replacedText = text;
  linkMap.forEach((newUrl, oldUrl) => {
    replacedText = replacedText.replace(oldUrl, newUrl);
  });
  return replacedText;
};

const getPopulatedBlogCategoryFields = (entry) => ({
  categoryName: {
    [locale]: entry.name,
  },
});

const getPopulatedBlogPostFields = (
  post,
  { categories, assets, linkMap },
  richtext
) => {
  const cmsHeroImageAsset = assets.find(
    (asset) => asset.wpAsset.mediaNumber === post.featured_media
  );
  const heroImageId = cmsHeroImageAsset && cmsHeroImageAsset.sys.id;
  const cmsCategory = categories.find(
    (category) => category.wpEntry.id === post.category
  );
  const categoryId = cmsCategory.sys.id;

  return {
    title: {
      [locale]: post.title,
    },
    body: {
      [locale]: replaceWPWithContentfulLinks(post.body, linkMap),
    },
    slug: {
      [locale]: post.slug,
    },
    publishDate: {
      [locale]: post.publishDate,
    },
    heroImage: heroImageId && {
      [locale]: {
        sys: {
          type: "Link",
          linkType: "Asset",
          id: heroImageId,
        },
      },
    },
    category: {
      [locale]: {
        sys: {
          type: "Link",
          linkType: "Entry",
          id: categoryId,
        },
      },
    },
    articleBody: {
      [locale]: richtext,
    },
  };
};

exports.getPopulatedEntryFields = (
  entry,
  contentType,
  linkingData,
  richtext
) => {
  const rt = richtext && richtext.content;
  switch (contentType) {
    case this.CONTENT_TYPES.CATEGORY:
      return getPopulatedBlogCategoryFields(entry);
    case this.CONTENT_TYPES.POST:
      return getPopulatedBlogPostFields(entry, linkingData, richtext);
    default:
      return null;
  }
};

const checkForExistingContentType = async (contentTypeName) => {
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
  const { id, name, fields } = contentType;

  try {
    const existingContentType = await checkForExistingContentType(name);
    if (existingContentType.length) return existingContentType[0];

    log("progress", `creating content type "${name}"`);
    const environment = await getContentfulEnvironment();
    const createdContentType = await environment.createContentTypeWithId(id, {
      displayField: fields[0].id,
      name,
      fields,
    });
    const publishedContentType = createdContentType.publish();

    log("progress", `successfully published content type "${name}"`);
    return publishedContentType;
  } catch (e) {
    log("error", `Content Type "${name}" failed to create`);
    log("error", e);
  }
};
