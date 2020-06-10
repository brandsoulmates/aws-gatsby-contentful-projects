const { getJSON } = require("./utils");

exports.getCategories = async (posts, apiURL) => {
  console.log(`\nGetting unique categories at api ${apiURL}`);
  const categories = await Promise.all(
    posts
      .reduce((all, post) => {
        if (!post.category) return all;
        if (all.indexOf(post.category) > -1) return all;
        return all.concat([post.category]);
      }, [])
      .map(async (categoryId) => {
        console.log(`...getting data for category ${categoryId}`);
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
