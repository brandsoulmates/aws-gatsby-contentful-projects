const { getJSON } = require("./utils");

exports.getCategories = async (posts, apiURL, log = console.log) => {
  const categories = await Promise.all(
    posts
      .reduce((all, post) => {
        if (!post.category) return all;
        if (all.indexOf(post.category) > -1) return all;
        return all.concat([post.category]);
      }, [])
      .map(async (categoryId) => {
        log(`getting data for category ${categoryId}`);
        const categoryData = await getJSON(`${apiURL}/${categoryId}`);
        return {
          id: categoryId,
          name: categoryData.name,
          slug: categoryData.slug,
          description: categoryData.description,
        };
      })
  );

  return categories;
};
