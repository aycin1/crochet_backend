const express = require("express");
const {
  getRefineParameters,
  getSinglePattern,
  getPatterns,
  getRandomPatterns,
} = require("../controllers/patternSearchController");
const router = express.Router();

router.get("/", async function (req, res) {
  try {
    const response = await getRefineParameters(req);
    res.send(response.data.pattern);
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
});

router.get("/filter/:id", async function (req, res) {
  try {
    const response = await getSinglePattern(req);
    res.send(response.data);
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
});

router.get("/refine/:params", async function (req, res) {
  try {
    const response = await getPatterns(req);
    res.send(response.data.patterns);
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
});

router.get("/randomiser", async function (req, res) {
  try {
    const response = await getRandomPatterns(req);
    res.send(response.data.patterns);
    //returns object where each key is id and respective value is object of properties
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

// router.get("/", async function (req, res) {
//   try {
//     const response = await getPatternCategories(req);
//     res.send(response.data.pattern_categories.children);
//   } catch (error) {
//     console.log(error);
//     res.send({ error });
//   }
// });

module.exports = router;
