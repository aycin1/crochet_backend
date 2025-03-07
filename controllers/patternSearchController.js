const axios = require("axios");
require("dotenv").config();

const url = "https://api.ravelry.com";
const headers = { "Content-Type": "application/json" };
const auth = {
  username: process.env.RAVELRY_USERNAME,
  password: process.env.RAVELRY_PASSWORD,
};

async function axiosCall(options) {
  try {
    const result = await axios(options);
    return result;
  } catch (e) {
    console.log(e);
    return e;
  }
}

async function getRefineParameters() {
  const options = {
    method: "GET",
    url: url + `/patterns/603.json`,
    headers: headers,
    auth: auth,
  };
  return await axiosCall(options);
}

async function getSinglePattern(req) {
  const id = req.params.id;
  const options = {
    method: "GET",
    url: url + `/patterns/${id}.json`,
    headers: headers,
    auth: auth,
  };
  return await axiosCall(options);
}

async function getPatterns(req) {
  const params = req.params.params;
  const options = {
    method: "GET",
    url: url + `/patterns/search.json?${params}`,
    headers: headers,
    auth: auth,
  };
  return await axiosCall(options);
}

async function getRandomPatterns() {
  function getRandomIntegers(max) {
    return Math.ceil(Math.random() * max);
  }

  const options = {
    method: "GET",
    url: url + `/patterns/search.json?ids=${getRandomIntegers(1000)}`,
    headers: headers,
    auth: auth,
  };
  return await axiosCall(options);
}

//  async function getPatternCategories() {
//   const options = {
//     method: "GET",
//     url: url + `/pattern_categories/list.json`,
//     headers: { "Content-Type": "application/json" },
//     auth: auth,
//   };
//   try {
//     const result = await axios(options);
//     return result;
//   } catch (e) {
//     console.log(e);
//     return error;
//   }
// }

module.exports = {
  getRefineParameters,
  getSinglePattern,
  getPatterns,
  getRandomPatterns,
};
