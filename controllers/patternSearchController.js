const axios = require("axios");
const url = "https://api.ravelry.com";
const headers = { "Content-Type": "application/json" };
const auth = {
  username: "read-7eba33215ade65d107df00cb4c2e7eb5",
  password: "/XfKCHMShFkU+XhVKuLKzVfP2CvayyP3gIeDfcp5",
};

async function axiosCall(options) {
  try {
    const result = await axios(options);
    return result;
  } catch (e) {
    console.log(e);
    return error;
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

module.exports = { getRefineParameters, getSinglePattern, getPatterns };
