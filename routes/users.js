const express = require("express");
const {
  handleFollowUser,
  handleUnfollowUser,
  handleUserSearch,
  getPostsForThisUser,
  getPostsForUser,
  checkIfFollowing,
  getFollowers,
  getFollowing,
} = require("../controllers/usersController");
const router = express.Router();

router.get("/search/:username", (req, res) => handleUserSearch(req, res));
router.get("/", (req, res) => getPostsForThisUser(req, res));
router.get("/posts/:username", (req, res) => getPostsForUser(req, res));
router.post("/", (req, res) => handleFollowUser(req, res));
router.delete("/", (req, res) => handleUnfollowUser(req, res));
router.get("/isFollowing/:searchedUser", (req, res) =>
  checkIfFollowing(req, res)
);
router.get("/user/followers", (req, res) => getFollowers(req, res));
router.get("/user/following", (req, res) => getFollowing(req, res));

module.exports = router;
