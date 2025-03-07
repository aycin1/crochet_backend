const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const fsPromises = require("fs").promises;
const path = require("path");

const data = {
  users: require("./../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

async function handleLogin(req, res) {
  const { username, password } = req.body;

  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and password are required" });

  const thisUser = data.users.find((user) => user.username === username);
  if (!thisUser) return res.status(401).json({ message: "Please try again" });

  const compare = await bcrypt.compare(password, thisUser.hashed_password);

  if (compare) {
    const accessToken = jwt.sign(
      // create JWTs
      { username: thisUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10m" }
    );
    const refreshToken = jwt.sign(
      { username: thisUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    const otherUsers = data.users.filter(
      (user) => user.username !== thisUser.username
    );
    const currentUser = { ...thisUser, refreshToken: refreshToken };
    data.setUsers([...otherUsers, currentUser]);

    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "users.json"),
      JSON.stringify(data.users)
    );

    // send tokens to user
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      // secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(201).json({ accessToken });
  } else {
    res.status(401).json({ message: "Please try again" });
  }
}

function getUser(req, res) {
  const username = req.user;
  const filter = data.users.filter((user) => user.username === username);
  if (filter.length) return res.status(200).json(filter);
}

module.exports = { handleLogin, getUser };
