const https = require("https");
const fetch = require("node-fetch");

const getJSON = async (url) => {
  const data = await fetch(url)
    .then((res) => res.json())
    .catch((e) => console.error(e));
  return data;
};

exports.generateAssetsList = (posts, baseUrl, simpleLog = console.log) =>
  new Promise(async (resolve) => {
    const apiURL = `${baseUrl.replace(/\/$/, "")}/categories`;
    // First reduce posts to an array of category numbers.
    simpleLog("Reducing posts to category numbers");
    const categories = await Promise.all(
      posts
        .reduce((all, post) => {
          if (!post.category) return all;
          if (all.indexOf(post.category) > -1) return all;
          return all.concat([post.category]);
        }, [])
        .map(async (categoryNumber) => {
          simpleLog(`Getting information about categories`);
          const categoryData = await getJSON(`${apiURL}/${categoryNumber}`);
          // console.log(categoryData);
          return {
            categoryNumber,
            name: categoryData.name,
            slug: categoryData.slug,
            description: categoryData.description,
          };
        })
    );
    resolve(categories);
  });
