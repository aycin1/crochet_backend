const express = require("express");
const { registerNewUser } = require("../controllers/registerController");
const router = express.Router();

router.post("/", (req, res) => registerNewUser(req, res));

module.exports = router;
