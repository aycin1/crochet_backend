const fsPromises = require("fs").promises;
const path = require("path");
require("dotenv").config();

const data = {
  likes: require("./../model/likes.json"),
  setLikes: function (data) {
    this.likes = data;
  },
};

function getLikes(req, res) {
  const post_id = req.params.post_id;

  const likedUsers = [];
  data.likes.map((post) => {
    if (post.post_id === post_id) likedUsers.push(post.liked_username);
  });

  return res.status(200).json(likedUsers);
}

async function addLike(req, res) {
  const { post_id, liked_username } = req.body;

  const thisLike = { post_id: post_id, liked_username: liked_username };
  const oldLikes = data.likes;
  data.setLikes([...oldLikes, thisLike]);

  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "likes.json"),
    JSON.stringify(data.likes)
  );

  return res.status(200).json({ message: `You have liked this post` });
}

async function removeLike(req, res) {
  const { post_id, liked_username } = req.body;

  const doesLikeExist = data.likes.find(
    (like) => like.post_id === post_id && like.liked_username === liked_username
  );

  const otherLikes = data.likes.filter(
    (like) =>
      !(like.post_id === post_id && like.liked_username === liked_username)
  );

  if (doesLikeExist) {
    data.setLikes([...otherLikes]);
  }

  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "likes.json"),
    JSON.stringify(data.likes)
  );

  return res.status(200).json({ message: `You have unliked this post` });
}

module.exports = { getLikes, addLike, removeLike };
