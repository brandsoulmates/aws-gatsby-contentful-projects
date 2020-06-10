const fetch = require("node-fetch");

exports.getJSON = async (url) => {
  try {
    const response = await fetch(url);
    if (response.ok) return await response.json();
  } catch (error) {
    console.error(error);
  }
  return null;
};
