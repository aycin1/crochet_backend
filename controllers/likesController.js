const query = require("../db/index.js");

async function getLikes(req, res) {
  const { post_id } = req.params;

  let likedUsers;

  try {
    likedUsers = await query("SELECT * FROM likes WHERE post_id = $1;", [
      post_id,
    ]);
  } catch (error) {
    console.log(error);
  }

  return res.status(200).json(likedUsers.rows);
}

async function checkIfLiked(req, res) {
  const { post_id } = req.params;
  const username = req.user;

  let isLiked;

  try {
    isLiked = await query(
      "SELECT * FROM likes WHERE post_id = $1 AND user_id = (SELECT user_id FROM users WHERE username = $2);",
      [post_id, username]
    );
  } catch (error) {
    console.log(error);
  }

  if (isLiked.rows.length) return res.status(200).json(true);
  else return res.status(204).json(false);
}

async function addLike(req, res) {
  const { post_id } = req.body;
  const username = req.user;

  let addLike;

  try {
    addLike = await query(
      "INSERT INTO likes (user_id, post_id) VALUES ((SELECT user_id FROM users WHERE username = $1), $2);",
      [username, post_id]
    );
  } catch (error) {
    console.log(error);
  }

  return res.status(200).json({ message: `You have liked this post` });
}

async function removeLike(req, res) {
  const { post_id } = req.body;
  const username = req.user;

  try {
    await query(
      "DELETE FROM likes WHERE post_id = $1 AND user_id = (SELECT user_id FROM users WHERE username = $2);",
      [post_id, username]
    );
  } catch (error) {
    console.log(error);
  }

  return res.status(200).json({ message: `You have unliked this post` });
}

module.exports = { getLikes, checkIfLiked, addLike, removeLike };
