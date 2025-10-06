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
  const { post_id } = req.params;

  const likedUsers = [];
  data.likes.map((post) => {
    if (post.post_id === post_id) {
      likedUsers.push(post.liked_username);
      return likedUsers;
    }
    return likedUsers;
  });

  return res.status(200).json({ likedUsers });
}

function checkIfLiked(req, res) {
  const { post_id } = req.params;
  const username = req.user;

  const isLiked = data.likes.find(
    (like) => like.liked_username === username && like.post_id === post_id
  );

  if (isLiked) return res.status(200).json(true);
  else return res.status(204).json(false);
}

async function addLike(req, res) {
  const { post_id } = req.body;
  const liked_username = req.user;

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
  const { post_id } = req.body;
  const liked_username = req.user;

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

module.exports = { getLikes, checkIfLiked, addLike, removeLike };
