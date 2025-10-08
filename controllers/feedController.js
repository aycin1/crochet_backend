const fsPromises = require("fs").promises;
const path = require("path");
require("dotenv").config();

const data = {
  lists: require("./../model/lists.json"),
  setLists: function (data) {
    this.lists = data;
  },
  following: require("./../model/following.json"),
  setFollowing: function (data) {
    this.following = data;
  },
  posts: require("./../model/posts.json"),
  setPosts: function (data) {
    this.posts = data;
  },
};

function isFollowing(username, post_username) {
  const isFollowing = data.following.find(
    (user) =>
      user.username === username && user.following_user === post_username
  );
  return isFollowing ? true : false;
}

function getPosts(req, res) {
  const username = req.user;

  const searchPosts = data.posts.filter(
    (post) =>
      isFollowing(username, post.username) === true ||
      username === post.username
  );
  return res.status(200).json({ searchPosts });
}

async function addPost(req, res) {
  const { pattern_id, caption, uuid } = req.body;
  const username = req.user;

  // const findPost = data.posts.find(
  //   (post) =>
  //     post.username === username &&
  //     post.pattern_id === pattern_id &&
  //     post.caption === caption
  // );
  // if (findPost)
  //   return res.status(200).json({
  //     message: "You have already posted this",
  //     findPost,
  //   });

  // const isPatternInCompletedList = data.lists.find(
  //   (pattern) =>
  //     pattern.pattern_id === pattern_id &&
  //     pattern.username === username &&
  //     pattern.list === "completed"
  // );
  // if (!isPatternInCompletedList)
  //   return res.status(200).json({
  //     message: "Pattern must be in your completed list to make a post",
  //   });

  const thisPost = {
    username: username,
    pattern_id: pattern_id,
    post_id: uuid,
    timestamp: Date.now(),
    caption: caption,
  };

  data.setPosts([thisPost, ...data.posts]);

  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "posts.json"),
    JSON.stringify(data.posts)
  );

  res.status(201).json({ message: "Posted" });
}

async function editPost(req, res) {
  const { post_id, caption } = req.body;
  const username = req.user;

  const thisPost = data.posts.find(
    (post) => post.username === username && post.post_id === post_id
  );

  if (!thisPost)
    return res
      .status(400)
      .json({ message: "Post not found, please try again" });

  thisPost.caption = caption;

  const otherPosts = data.posts.filter(
    (post) =>
      (post.username !== username && post.post_id !== post_id) ||
      (post.username !== username && post.post_id === post_id) ||
      (post.username === username && post.post_id !== post_id)
  );

  data.setPosts([thisPost, ...otherPosts]);

  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "posts.json"),
    JSON.stringify(data.posts)
  );

  res.status(200).json({ message: "Post edited" });
}

async function deletePost(req, res) {
  const { post_id } = req.body;
  const username = req.user;
  console.log(post_id);
  const thisPost = data.posts.find(
    (post) => post.username === username && post.post_id === post_id
  );

  if (!thisPost)
    return res
      .status(400)
      .json({ message: "Post not found, please try again" });

  const otherPosts = data.posts.filter(
    (post) =>
      (post.username !== username && post.post_id !== post_id) ||
      (post.username !== username && post.post_id === post_id) ||
      (post.username === username && post.post_id !== post_id)
  );

  data.setPosts([...otherPosts]);

  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "posts.json"),
    JSON.stringify(data.posts)
  );

  res.status(200).json({ message: "Post deleted" });
}

module.exports = { getPosts, addPost, editPost, deletePost };
