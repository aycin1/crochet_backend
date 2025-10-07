const express = require("express");
const {
  getSinglePattern,
  getPatterns,
  getPatternCategories,
  getPatternAttributes,
} = require("../controllers/patternSearchController");
const router = express.Router();

router.get("/filter/:id", async function (req, res) {
  try {
    const response = await getSinglePattern(req);
    res.send(response.data);
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
});

router.get("/refine", async function (req, res) {
  try {
    const response = await getPatterns(req);
    res.send(response?.data?.patterns);
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
});

router.get("/categories", async function (req, res) {
  try {
    const response = await getPatternCategories(req);
    res.send(response.data.pattern_categories.children);
  } catch (error) {
    console.log(error);
    res.send({ error });
  }
});

router.get("/attributes", async function (req, res) {
  try {
    const response = await getPatternAttributes(req);
    res.send(response.data.attribute_groups);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
