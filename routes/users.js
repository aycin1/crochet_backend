const express = require("express");
const {
  getUserPosts,
  handleUserSearch,
} = require("../controllers/usersController");
const router = express.Router();

router.get("/", (req, res) => getUserPosts(req, res));
router.get("/search/:username", (req, res) => handleUserSearch(req, res));

module.exports = router;
