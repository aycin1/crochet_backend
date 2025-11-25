const bcrypt = require("bcrypt");
const db = require("../db/index.js");

async function registerNewUser(req, res) {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res
      .status(400)
      .json({ message: "Please complete all fields to register" });
  }

  let emailQuery;
  let usernameQuery;

  try {
    emailQuery = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    usernameQuery = await db.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
  } catch (error) {
    console.log(error);
  }

  if (emailQuery.rows.length) {
    return res.status(409).json({
      message: "An account with this email address exists, please sign in",
    });
  }

  if (usernameQuery.rows.length) {
    return res.status(409).json({
      message: "This username has been taken, please try a different one",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    await db.query(
      "INSERT INTO users (username, email, password, refresh_token) VALUES ($1, $2, $3, $4)",
      [username, email, hashedPassword, ""]
    );

    await db.query(
      "INSERT INTO lists (name, user_id) VALUES ('wishlist', (SELECT user_id FROM users WHERE username = $1));",
      [username]
    );
    await db.query(
      "INSERT INTO lists (name, user_id) VALUES ('in-progress', (SELECT user_id FROM users WHERE username = $1));",
      [username]
    );
    await db.query(
      "INSERT INTO lists (name, user_id) VALUES ('completed', (SELECT user_id FROM users WHERE username = $1));",
      [username]
    );
  } catch (error) {
    console.log(error);
  }

  return res
    .status(201)
    .json({ message: "You have successfully registered an account!" });
}

module.exports = { registerNewUser };
