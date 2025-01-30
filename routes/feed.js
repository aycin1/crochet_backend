const express = require("express");
const {
  getUploadAuth,
  getPosts,
  addPost,
  deletePost,
} = require("../controllers/feedController");
const router = express.Router();

router.get("/auth", (req, res) => getUploadAuth(req, res));
router.get("/:username", (req, res) => getPosts(req, res));
router.post("/", (req, res) => addPost(req, res));
router.delete("/", (req, res) => deletePost(req, res));

module.exports = router;
