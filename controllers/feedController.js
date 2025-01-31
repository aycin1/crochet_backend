const fsPromises = require("fs").promises;
const path = require("path");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const ImageKit = require("imagekit");
const imagekit = new ImageKit({
  publicKey: process.env.PUBLIC_KEY,
  privateKey: process.env.PRIVATE_KEY,
  urlEndpoint: process.env.URL_ENDPOINT,
});

function getUploadAuth(req, res) {
  const result = imagekit.getAuthenticationParameters();
  res.send(result);
}

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
  const username = req.params.username;

  const searchPosts = data.posts.filter(
    (post) =>
      isFollowing(username, post.username) === true ||
      username === post.username
  );
  return res.status(200).json({ searchPosts });
}

async function addPost(req, res) {
  const { username, pattern_id, caption } = req.body;

  const findPost = data.posts.find(
    (post) =>
      post.username === username &&
      post.pattern_id === pattern_id &&
      post.caption === caption
  );
  if (findPost)
    return res.status(200).json({
      message: "You have already posted this",
    });

  const isPatternInCompletedList = data.lists.find(
    (pattern) =>
      pattern.pattern_id === pattern_id &&
      pattern.username === username &&
      pattern.list === "completed"
  );
  if (!isPatternInCompletedList)
    return res.status(200).json({
      message: "Pattern must be in your completed list to make a post",
    });

  const thisPost = {
    username: username,
    pattern_id: pattern_id,
    post_id: uuidv4(),
    timestamp: Date.now(),
    caption: caption,
  };

  thisPost.img_url = process.env.urlEndpoint + "/" + thisPost.post_id;

  data.setPosts([...data.posts, thisPost]);

  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "posts.json"),
    JSON.stringify(data.posts)
  );

  res.status(201).json({ message: "Posted" });
}

async function editPost(req, res) {
  const { username, post_id, caption } = req.body;

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

  data.setPosts([...otherPosts, thisPost]);

  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "posts.json"),
    JSON.stringify(data.posts)
  );

  res.status(200).json({ message: "Post edited" });
}

async function deletePost(req, res) {
  const { username, post_id } = req.body;

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

module.exports = { getUploadAuth, getPosts, addPost, editPost, deletePost };
