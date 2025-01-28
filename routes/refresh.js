const express = require("express");
const { handleRefreshToken } = require("../controllers/refreshController");
const router = express.Router();

router.get("/", (req, res) => handleRefreshToken(req, res));

module.exports = router;
