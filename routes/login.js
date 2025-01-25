const express = require("express");
const { handleLogin, getUser } = require("../controllers/loginController");
const router = express.Router();

router.post("/", (req, res) => handleLogin(req, res));
router.get("/:username", (req, res) => getUser(req, res));

module.exports = router;
