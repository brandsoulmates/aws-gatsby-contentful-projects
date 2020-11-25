const { getJSON, log } = require("../utils");

const exportPageOfTags = async (apiUrl, page = 1, allTags = []) => {
  log("progress", `getting tags for page ${page}`);
  const url = `${apiUrl}?page=${page}`;
  const tags = await getJSON(url);
  return tags.length > 0
    ? await exportPageOfTags(apiUrl, page + 1, allTags.concat(tags))
    : allTags;
};

exports.getTags = async (apiUrl) => {
  log("info", `Getting tags from api ${apiUrl}`, true);
  const allTags = await exportPageOfTags(apiUrl);

  if (!allTags.length)
    log(
      "error",
      `${chalk.red("Error")}: Unable to retrieve tags for ${apiUrl}\n`
    );
  else log("success", `Retrieved ${allTags.length} tags`);

  return allTags;
};
