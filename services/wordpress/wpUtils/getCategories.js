const { getJSON, log } = require("../utils");

exports.getCategories = async (posts, apiUrl) => {
  log("info", `Getting unique categories from api ${apiUrl}`, true);

  const categories = await Promise.all(
    posts
      .reduce((all, post) => {
        if (!post.category) return all;
        if (all.indexOf(post.category) > -1) return all;
        return all.concat([post.category]);
      }, [])
      .map(async (categoryId, i, arr) => {
        log("progress", `getting data for category ${i + 1} of ${arr.length}`);
        const categoryData = await getJSON(`${apiUrl}/${categoryId}`);
        return {
          id: categoryId,
          name: categoryData.name,
          slug: categoryData.slug,
          description: categoryData.description,
        };
      })
  );

  if (!categories.length) log("warning", "No categories were found");
  else log("success", `Retrieved ${categories.length} unique categories`);

  return categories;
};
