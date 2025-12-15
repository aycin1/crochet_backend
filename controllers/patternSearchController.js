const axios = require("axios");

const url = "https://api.ravelry.com/";
const headers = { "Content-Type": "application/json" };
const auth = {
  username: process.env.RAVELRY_USERNAME,
  password: process.env.RAVELRY_PASSWORD,
};

async function axiosCall(options) {
  try {
    const response = await axios(options);
    return response;
  } catch (e) {
    console.log(e);
  }
}

async function getSinglePattern(req) {
  const { id } = req.params;

  const options = {
    method: "GET",
    url: `${url}/patterns/${id}.json`,
    headers: headers,
    auth: auth,
  };
  return await axiosCall(options);
}

async function getPatterns(req) {
  const queries = req.query;

  const queryArr = Object.entries(queries)?.map(
    ([key, value]) => `${key}=${value}`
  );
  queryArr.push("page_size=30");

  const options = {
    method: "GET",
    headers: headers,
    auth: auth,
    url: queryArr.length
      ? `${url}/patterns/search.json?${queryArr.join("&")}`
      : `${url}/patterns/search.json`,
  };
  const response = await axiosCall(options);
  const idArr = response?.data?.patterns.map((pattern) => pattern.id);
  return idArr;
}

async function getPatternCategories() {
  const options = {
    method: "GET",
    url: `${url}/pattern_categories/list.json`,
    headers: headers,
    auth: auth,
  };
  return await axiosCall(options);
}

async function getPatternAttributes() {
  const options = {
    method: "GET",
    url: `${url}/pattern_attributes/groups.json`,
    headers: headers,
    auth: auth,
  };
  return await axiosCall(options);
}

module.exports = {
  getSinglePattern,
  getPatterns,
  getPatternCategories,
  getPatternAttributes,
};
