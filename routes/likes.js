const express = require("express");
const {
  getLikes,
  addLike,
  removeLike,
  checkIfLiked,
} = require("./../controllers/likesController");
const router = express.Router();

router.get("/:post_id", (req, res) => getLikes(req, res));
router.post("/", (req, res) => addLike(req, res));
router.delete("/", (req, res) => removeLike(req, res));
router.get("/user/:post_id", (req, res) => checkIfLiked(req, res));

module.exports = router;
