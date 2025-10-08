const express = require("express");
const {
  getLists,
  getListForPattern,
  handlePatternAddition,
  handleListChange,
  handlePatternDeletion,
} = require("../controllers/listsController");
const router = express.Router();

router.get("/", (req, res) => getLists(req, res));
router.get("/pattern", (req, res) => getListForPattern(req, res));
router.post("/", (req, res) => handlePatternAddition(req, res));
router.patch("/", (req, res) => handleListChange(req, res));
router.delete("/", (req, res) => handlePatternDeletion(req, res));

module.exports = router;
