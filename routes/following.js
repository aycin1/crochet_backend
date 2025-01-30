const express = require("express");
const {
  handleFollowUser,
  handleUnfollowUser,
  handleUserSearch,
} = require("../controllers/followingController");
const router = express.Router();

router.post("/", (req, res) => handleFollowUser(req, res));
router.delete("/", (req, res) => handleUnfollowUser(req, res));
router.get("/:username", (req, res) => handleUserSearch(req, res));

module.exports = router;
