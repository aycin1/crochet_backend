const fsPromises = require("fs").promises;
const path = require("path");

const data = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

async function handleLogout(req, res) {
  // accessToken to be deleted on client-side.
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204);
  const refreshToken = cookies.jwt;

  const thisUser = data.users.find(
    (user) => user.refreshToken === refreshToken
  );
  if (!thisUser) {
    res.clearCookie("jwt", {
      httpOnly: true,
      sameSite: "None", //secure:true
    });
    return res.sendStatus(204);
  }

  const otherUsers = data.users.filter(
    (user) => user.refreshToken !== thisUser.refreshToken
  );
  const currentUser = { ...thisUser, refreshToken: "" };
  data.setUsers([...otherUsers, currentUser]);
  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "users.json"),
    JSON.stringify(data.users)
  );

  res.clearCookie("jwt", {
    httpOnly: true,
    sameSite: "None",
    // secure:true
  });
  res.sendStatus(204);
}

module.exports = { handleLogout };
