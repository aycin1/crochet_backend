const express = require("express");
const {
  getUser,
  getUserPosts,
  handleUserSearch,
} = require("../controllers/usersController");
const router = express.Router();

router.get("/", (req, res) => getUser(req, res));
router.get("/posts", (req, res) => getUserPosts(req, res));
router.get("/search/:username", (req, res) => handleUserSearch(req, res));

module.exports = router;
