const express = require("express");
const {
  getComments,
  addComment,
  removeComment,
} = require("./../controllers/commentsController");
const router = express.Router();

router.get("/:post_id", (req, res) => getComments(req, res));
router.post("/", (req, res) => addComment(req, res));
router.delete("/", (req, res) => removeComment(req, res));

module.exports = router;
