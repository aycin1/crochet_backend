const jwt = require("jsonwebtoken");
const db = require("../db/index.js");

async function handleRefreshToken(req, res) {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401).json({ error: "Unauthorized" });
  const refreshToken = cookies.jwt;

  let thisUser;

  try {
    thisUser = await db.query("SELECT * FROM users WHERE refresh_token = $1;", [
      refreshToken,
    ]);
  } catch (error) {
    console.log(error);
  }

  if (!thisUser.rows.length)
    return res.status(403).json({ error: "Forbidden" });

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (error, decoded) => {
      if (error || thisUser.rows[0].username !== decoded.username)
        return res.status(403).json({ error: "Forbidden" });
      const accessToken = jwt.sign(
        { username: decoded.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "15m" }
      );
      res.json({ accessToken });
    }
  );
}

module.exports = { handleRefreshToken };
