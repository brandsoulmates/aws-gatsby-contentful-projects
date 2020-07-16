const fetch = require("node-fetch");
const chalk = require("chalk");

exports.getJSON = async (url) => {
  try {
    const response = await fetch(url);
    if (response.ok) return await response.json();
  } catch (error) {
    console.error(error);
  }
  return null;
};

exports.log = (level, message, newSection) => {
  if (newSection) console.log("");
  switch (level) {
    case "info":
      console.log(`${chalk.blue(level)} ${message}`);
      break;
    case "success":
      console.log(`${chalk.green(level)} ${message}`);
      break;
    case "warning":
      console.log(`${chalk.yellow(level)} ${message}`);
      break;
    case "error":
      console.error(`${chalk.red(level)} ${message}`);
      break;
    case "progress":
      console.log(chalk.dim(`...${message}`));
      break;
    default:
      console.log(level, message);
  }
};

exports.getUniqueImages = (arr) => {
  return Array.from(new Set(arr.map((a) => a.link))).map((link) => {
    return arr.find((a) => a.link === link);
  });
};

// exports.createAndPublishEmbeds = async (
//   image,
//   externalLink,
//   create,
//   publish
// ) => {
//   const cmsEntries = [];
//   const cmsExternalEntry = await create(
//     {
//       linkId: externalLink,
//     },
//     CONTENT_TYPES.EXTERNAL_LINK
//   );
//   const cmsNavigationEntry = await create(
//     {
//       title: `Navigation - ${link}`,
//       linkId: cmsExternalEntry.sys.id,
//     },
//     CONTENT_TYPES.NAV_ITEM
//   );
//   const cmsMediaImageEntry = await create(
//     {
//       title: `Media - ${image}`,
//       linkId: image,
//       navId: cmsNavigationEntry.sys.id,
//     },
//     CONTENT_TYPES.MEDIA_IMAGE,
//     linkingData
//   );

//   // cmsEntries.push(cmsNavigationEntry, cmsExternalEntry, cmsMediaImageEntry);

//   // await Promise.all(
//   //   cmsEntries.map(async (entry) => {
//   //     return await publish(entry);
//   //   })
//   // );
//   // const publishedEntry = await publishEntry(cmsEntry);
// };
