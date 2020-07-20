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

const blogTagFields = [
  {
    id: "blogTag",
    name: "Tag Name",
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
    id: "tag",
    name: "Tag",
    type: "Array",
    localized: false,
    required: false,
    validations: [],
    disabled: false,
    omitted: false,
    items: {
      type: "Link",
      validations: [
        {
          linkContentType: ["blogTag"],
        },
      ],
      linkType: "Entry",
    },
  },
  {
    id: "body",
    name: "Body",
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
          "hyperlink",
          "entry-hyperlink",
          "embedded-asset-block",
          "embedded-entry-block",
        ],
        message:
          "Only heading 1, heading 2, heading 3, heading 4, heading 5, heading 6, ordered list, unordered list, horizontal rule, quote, link to Url, link to entry, and inline entry nodes are allowed",
      },
    ],
    disabled: false,
    omitted: false,
  },
];

const mediaImageFields = [
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
    id: "src",
    name: "Source",
    type: "Symbol",
    localized: false,
    required: true,
    validations: [
      {
        in: ["Contentful - JPG", "Contentful - PNG"],
      },
    ],
    disabled: false,
    omitted: false,
  },
  {
    id: "srcContentful",
    name: "Source - Contentful Asset",
    type: "Link",
    localized: false,
    required: false,
    validations: [],
    disabled: false,
    omitted: false,
    linkType: "Asset",
  },
  {
    id: "thumbnail",
    name: "Thumbnail",
    type: "Link",
    localized: false,
    required: true,
    validations: [],
    disabled: false,
    omitted: false,
    linkType: "Asset",
  },
  {
    id: "navigationLink",
    name: "Navigation Link",
    type: "Link",
    localized: false,
    required: false,
    validations: [
      {
        linkContentType: ["navigationItem"],
      },
    ],
    disabled: false,
    omitted: false,
    linkType: "Entry",
  },
];

const navItemFields = [
  {
    id: "displayText",
    name: "Display Text",
    type: "Symbol",
    localized: true,
    required: true,
    validations: [],
    disabled: false,
    omitted: false,
  },
  {
    id: "navigationLink",
    name: "Navigation Link",
    type: "Link",
    localized: false,
    required: false,
    validations: [
      {
        linkContentType: ["externalLink"],
      },
    ],
    disabled: false,
    omitted: false,
    linkType: "Entry",
  },
];

const externalLinkFields = [
  {
    id: "internalTitle",
    name: "Internal - Title",
    type: "Symbol",
    localized: false,
    required: true,
    validations: [],
    disabled: false,
    omitted: false,
  },
  {
    id: "url",
    name: "Url",
    type: "Symbol",
    localized: false,
    required: false,
    validations: [],
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
  MEDIA_IMAGE: {
    id: "mediaImage",
    name: "Media - Image",
    fields: mediaImageFields,
  },
  NAV_ITEM: {
    id: "navigationItem",
    name: "Navigation Item",
    fields: navItemFields,
  },
  EXTERNAL_LINK: {
    id: "externalLink",
    name: "External Link",
    fields: externalLinkFields,
  },
  TAG: { id: "blogTag", name: "Blog Tag", fields: blogTagFields },
};

const getPopulatedBlogCategoryFields = (entry) => ({
  categoryName: {
    [locale]: entry.name,
  },
});

const getPopulatedBlogTagFields = (entry) => ({
  blogTag: {
    [locale]: entry.name,
  },
});

const getPopulatedBlogPostFields = (
  post,
  { categories, assets, tags: tagsList, linkMap },
  richtext
) => {
  const cmsHeroImageAsset = assets.find(
    (asset) =>
      asset.wpAsset.mediaNumber === post.featured_media ||
      asset.wpAsset.link === post.heroImage
  );
  const heroImageId = cmsHeroImageAsset && cmsHeroImageAsset.sys.id;
  const cmsCategory = categories.find(
    (category) => category.wpEntry.id === post.category
  );
  const categoryId = cmsCategory.sys.id;
  const cmsTags = post.tags.map((tagId) =>
    tagsList.find((t) => t.wpEntry.id === tagId)
  );
  const tagIds = cmsTags.map((t) => t.sys.id);

  return {
    title: {
      [locale]: post.title,
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
    tag: {
      [locale]: tagIds.map((tagId) => ({
        sys: {
          type: "Link",
          linkType: "Entry",
          id: tagId,
        },
      })),
    },
    body: {
      [locale]: richtext,
    },
  };
};

const getPopulatedMediaImageFields = (entry, { assets }) => {
  const cmsImageAsset = assets.find(
    (asset) => asset.wpAsset.link === entry.linkId
  );
  const imageId = cmsImageAsset && cmsImageAsset.sys.id;
  return {
    title: {
      [locale]: entry.title,
    },
    src: {
      [locale]: "Contentful - JPG",
    },
    srcContentful: imageId && {
      [locale]: {
        sys: {
          type: "Link",
          linkType: "Asset",
          id: imageId,
        },
      },
    },
    thumbnail: imageId && {
      [locale]: {
        sys: {
          type: "Link",
          linkType: "Asset",
          id: imageId,
        },
      },
    },
    navigationLink: {
      [locale]: {
        sys: {
          type: "Link",
          linkType: "Entry",
          id: entry.navId,
        },
      },
    },
  };
};

const getPopulatedExternalLinkFields = (entry) => ({
  internalTitle: {
    [locale]: entry.linkId,
  },
  url: {
    [locale]: entry.linkId,
  },
});

const getPopulatedNavItemFields = (entry) => ({
  displayText: {
    [locale]: entry.title,
  },
  navigationLink: {
    [locale]: {
      sys: {
        type: "Link",
        linkType: "Entry",
        id: entry.linkId,
      },
    },
  },
});

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
    case this.CONTENT_TYPES.TAG:
      return getPopulatedBlogTagFields(entry);
    case this.CONTENT_TYPES.POST:
      return getPopulatedBlogPostFields(
        entry,
        linkingData,
        richtext.convertToRichText
      );
    case this.CONTENT_TYPES.MEDIA_IMAGE:
      return getPopulatedMediaImageFields(entry, linkingData);
    case this.CONTENT_TYPES.EXTERNAL_LINK:
      return getPopulatedExternalLinkFields(entry);
    case this.CONTENT_TYPES.NAV_ITEM:
      return getPopulatedNavItemFields(entry);
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
