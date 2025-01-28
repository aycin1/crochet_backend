const express = require("express");
const { handleLogout } = require("../controllers/logoutController");
const router = express.Router();

router.get("/", (req, res) => handleLogout(req, res));

module.exports = router;
