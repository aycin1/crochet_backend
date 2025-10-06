const express = require("express");
const {
  getPosts,
  addPost,
  editPost,
  deletePost,
} = require("../controllers/feedController");
const router = express.Router();

router.get("/", (req, res) => getPosts(req, res));
router.post("/", (req, res) => addPost(req, res));
router.put("/", (req, res) => editPost(req, res));
router.delete("/", (req, res) => deletePost(req, res));

module.exports = router;
