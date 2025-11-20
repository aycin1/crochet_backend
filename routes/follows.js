const express = require("express");
const {
  checkIfFollowing,
  handleFollowUser,
  handleUnfollowUser,
  getFollowCount,
} = require("../controllers/followsController");
const router = express.Router();

router.get("/", (req, res) => checkIfFollowing(req, res));
router.post("/", (req, res) => handleFollowUser(req, res));
router.delete("/", (req, res) => handleUnfollowUser(req, res));
router.get("/count", (req, res) => getFollowCount(req, res));

module.exports = router;
