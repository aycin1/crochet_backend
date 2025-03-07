const fsPromises = require("fs").promises;
const path = require("path");

const data = {
  following: require("./../model/following.json"),
  setFollowing: function (data) {
    this.following = data;
  },
  users: require("./../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

function handleUserSearch(req, res) {
  const username = req.params.username;

  const usernameSearch = data.users.find((user) => user.username === username);

  if (!usernameSearch)
    return res
      .status(200)
      .json({ message: "No user found with that username, please try again" });

  return res.status(200).json({ username });
}

async function handleFollowUser(req, res) {
  const { following_user } = req.body;
  const username = req.user;

  const otherFollows = data.following.filter(
    (user) =>
      (user.username !== username && user.following_user !== following_user) ||
      (user.username === username && user.following_user !== following_user) ||
      (user.username !== username && user.following_user === following_user)
  );

  const thisFollow = { username: username, following_user: following_user };

  data.setFollowing([...otherFollows, thisFollow]);

  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "following.json"),
    JSON.stringify(data.following)
  );

  return res
    .status(200)
    .json({ message: `You are now following ${following_user}` });
}

async function handleUnfollowUser(req, res) {
  const { unfollowing_user } = req.body;
  const username = req.user;

  const toUnfollow = data.following.find(
    (user) =>
      user.username === username && user.following_user === unfollowing_user
  );
  if (!toUnfollow) return res.sendStatus(200);

  const otherFollows = data.following.filter(
    (user) =>
      (user.username !== username &&
        user.following_user !== unfollowing_user) ||
      (user.username === username &&
        user.following_user !== unfollowing_user) ||
      (user.username !== username && user.following_user === unfollowing_user)
  );

  data.setFollowing([...otherFollows]);

  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "following.json"),
    JSON.stringify(data.following)
  );

  return res
    .status(200)
    .json({ message: `You have stopped following ${unfollowing_user}` });
}

module.exports = { handleFollowUser, handleUnfollowUser, handleUserSearch };
