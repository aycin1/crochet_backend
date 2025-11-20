const bcrypt = require("bcrypt");
const db = require("../db/index.js");

async function registerNewUser(req, res) {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res
      .status(400)
      .json({ message: "Please complete all fields to register" });
  }

  const emailQuery = await db.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (emailQuery.rows.length) {
    return res.status(409).json({
      message: "An account with this email address exists, please sign in",
    });
  }

  const usernameQuery = await db.query(
    "SELECT * FROM users WHERE username = $1",
    [username]
  );

  if (usernameQuery.rows.length) {
    return res.status(409).json({
      message: "This username has been taken, please try a different one",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await db.query("INSERT INTO users VALUES ($1, $2, $3, $4)", [
    username,
    email,
    hashedPassword,
    "",
  ]);

  return res
    .status(201)
    .json({ message: "You have successfully registered an account!" });
}

module.exports = { registerNewUser };
