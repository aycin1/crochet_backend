const jwt = require("jsonwebtoken");
require("dotenv").config();

const data = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

function handleRefreshToken(req, res) {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.status(401).json({ error: "Unauthorized" });
  const refreshToken = cookies.jwt;

  const thisUser = data.users.find(
    (user) => user.refreshToken === refreshToken
  );
  if (!thisUser) return res.status(403).json({ error: "Forbidden" });

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (error, decoded) => {
      if (error || thisUser.username !== decoded.username)
        return res.status(403).json({ error: "Forbidden" });
      const accessToken = jwt.sign(
        { username: decoded.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "10m" }
      );
      res.json({ accessToken });
    }
  );
}

module.exports = { handleRefreshToken };
