const express = require("express");
const {
  getUploadAuth,
  getPosts,
  addPost,
  editPost,
  deletePost,
} = require("../controllers/feedController");
const router = express.Router();

router.get("/auth", (req, res) => getUploadAuth(req, res));
router.get("/:username", (req, res) => getPosts(req, res));
router.post("/", (req, res) => addPost(req, res));
router.put("/", (req, res) => editPost(req, res));
router.delete("/", (req, res) => deletePost(req, res));

module.exports = router;
