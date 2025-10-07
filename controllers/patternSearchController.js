const axios = require("axios");
const { response } = require("express");
require("dotenv").config();

const url = "https://api.ravelry.com/patterns";
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
    url: url + `/${id}.json`,
    headers: headers,
    auth: auth,
  };
  return await axiosCall(options);
}

async function getPatterns(req) {
  const queries = req.query;

  const options = {
    method: "GET",
    headers: headers,
    auth: auth,
  };

  const keys = Object?.keys(queries)?.map((query) => query);
  const queryArr = Object?.values(queries)?.map(
    (query, index) => `${keys[index]}=${query}`
  );

  options.url = queryArr.length
    ? `${url}/search.json?${queryArr.join("&")}`
    : `${url}/search.json`;

  return await axiosCall(options);
}

async function getPatternCategories() {
  const options = {
    method: "GET",
    url: "https://api.ravelry.com/pattern_categories/list.json",
    headers: headers,
    auth: auth,
  };
  return await axiosCall(options);
}

async function getPatternAttributes() {
  const options = {
    method: "GET",
    url: "https://api.ravelry.com/pattern_attributes/groups.json",
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
