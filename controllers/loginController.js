const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const db = require("../db/index.js");

async function handleLogin(req, res) {
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required" });

  const thisUser = await db.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);

  if (!thisUser.rows.length)
    return res.status(401).json({
      message: "No user found, please try again or create an account",
    });

  const compare = await bcrypt.compare(password, thisUser.rows[0].password);

  if (compare) {
    try {
      // create JWTs
      const accessToken = jwt.sign(
        { username: username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      const refreshToken = jwt.sign(
        { username: username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: "1d" }
      );

      await db.query(
        "UPDATE users SET refresh_token = $1 WHERE username = $2",
        [refreshToken, username]
      );

      // send tokens to user
      res.cookie("jwt", refreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      res.status(201).json({ accessToken });
    } catch (error) {
      console.log("Error processing login:", error);
      return res.status(500).json({ message: "Server error" });
    }
  } else {
    return res.status(401).json({ message: "Please try again" });
  }
}

module.exports = { handleLogin };
