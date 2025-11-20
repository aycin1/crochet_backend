const db = require("../db/index.js");

async function handleLogout(req, res) {
  const cookies = req.cookies;

  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;

  const thisUser = await db.query(
    "SELECT * FROM users WHERE refresh_token = $1",
    [refreshToken]
  );

  if (!thisUser.rows.length) {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None",
      secure: true,
    });
    return res.sendStatus(204);
  }

  await db.query(
    "UPDATE users SET refresh_token = $1 WHERE refresh_token = $2",
    ["", refreshToken]
  );

  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });
  res.sendStatus(204);
}

module.exports = { handleLogout };
