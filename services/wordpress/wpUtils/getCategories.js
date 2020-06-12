const { getJSON } = require("../utils");

exports.getCategories = async (posts, apiUrl) => {
  console.log(`\nGeting unique categories from api ${apiUrl}`);

  const categories = await Promise.all(
    posts
      .reduce((all, post) => {
        if (!post.category) return all;
        if (all.indexOf(post.category) > -1) return all;
        return all.concat([post.category]);
      }, [])
      .map(async (categoryId) => {
        console.log(`...getting data for category ${categoryId}`);
        const categoryData = await getJSON(`${apiUrl}/${categoryId}`);
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
