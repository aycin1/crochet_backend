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

function getUser(req, res) {
  const username = req.user;
  const thisUser = data.users.find((user) => user.username === username);
  if (thisUser) return res.status(200).json(thisUser.username);
  else return res.sendStatus(404);
}

function getUserPosts(req, res) {
  const { username } = req.query;
  const posts = data.posts.filter((post) => post.username === username);
  return res.status(200).json({ posts });
}

function handleUserSearch(req, res) {
  const { username } = req.params;
  const usernameSearch = data.users.find((user) => user.username === username);

  if (!usernameSearch)
    return res
      .status(404)
      .json({ message: "No user found with that username, please try again" });
  return res.status(200).json({ username });
}

module.exports = { getUser, getUserPosts, handleUserSearch };
