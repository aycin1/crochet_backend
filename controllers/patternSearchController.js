const axios = require("axios");
const { response } = require("express");

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

  const keys = Object?.keys(queries)?.map((query) => query);
  const queryArr = Object?.values(queries)?.map(
    (query, index) => `${keys[index]}=${query}`
  );

  const options = {
    method: "GET",
    headers: headers,
    auth: auth,
    url: queryArr.length
      ? `${url}/patterns/search.json?${queryArr.join("&")}`
      : `${url}/patterns/search.json`,
  };
  return await axiosCall(options);
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
