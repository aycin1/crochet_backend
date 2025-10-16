const express = require("express");
const { handleLogin } = require("../controllers/loginController");
const router = express.Router();

router.post("/", (req, res) => handleLogin(req, res));

module.exports = router;
