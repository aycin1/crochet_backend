const fsPromises = require("fs").promises;
const path = require("path");

const data = {
  following: require("../model/following.json"),
  setFollowing: function (data) {
    this.following = data;
  },
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
  posts: require("../model/posts.json"),
  setPosts: function (data) {
    this.posts = data;
  },
};

function handleUserSearch(req, res) {
  const { username } = req.params;

  const usernameSearch = data.users.find((user) => user.username === username);

  if (!usernameSearch)
    return res
      .status(404)
      .json({ message: "No user found with that username, please try again" });

  return res.status(200).json({ username });
}

async function handleFollowUser(req, res) {
  const { following_user } = req.body;
  const username = req.user;
  console.log(following_user);
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

async function getPostsForThisUser(req, res) {
  const username = req.user;
  const posts = data.posts.filter((post) => post.username === username);
  return res.status(200).json({ posts });
}

async function getPostsForUser(req, res) {
  const { username } = req.params;
  const posts = data.posts.filter((post) => post.username === username);
  return res.status(200).json({ posts });
}

function checkIfFollowing(req, res) {
  const { searchedUser } = req.params;
  const currentUser = req.user;

  const isFollowing = data.following.find(
    (user) =>
      user.username === currentUser && user.following_user === searchedUser
  );

  if (isFollowing) return res.status(200).json(true);
  return res.status(204).json(false);
}

async function getFollowers(req, res) {
  const currentUser = req.user;
  const followers = data.following.filter(
    (follow) => follow.following_user === currentUser
  );
  return res.status(200).json({ followers });
}

async function getFollowing(req, res) {
  const currentUser = req.user;
  const following = data.following.filter(
    (follow) => follow.username === currentUser
  );
  return res.status(200).json({ following });
}

module.exports = {
  handleUserSearch,
  handleFollowUser,
  handleUnfollowUser,
  getPostsForThisUser,
  getPostsForUser,
  checkIfFollowing,
  getFollowers,
  getFollowing,
};
