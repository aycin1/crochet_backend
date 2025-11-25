const db = require("../db/index.js");

async function getPosts(req, res) {
  const username = req.user;

  let posts;

  try {
    posts = await db.query(
      "SELECT p.*, u.username FROM posts p FULL JOIN followings f ON f.following_id = p.user_id JOIN users u ON u.user_id = p.user_id WHERE p.user_id = (SELECT user_id FROM users WHERE username = $1) OR f.user_id = (SELECT user_id FROM users WHERE username = $1) AND f.following_id = p.user_id ORDER BY p.id DESC;",
      [username]
    );
  } catch (error) {
    console.log(error);
  }

  return res.status(200).json(posts?.rows);
}

async function addPost(req, res) {
  const { pattern_id, caption, uuid } = req.body;
  const username = req.user;

  try {
    await db.query(
      "INSERT INTO posts (post_id, pattern_id, user_id, date, caption) SELECT $1, $2, user_id, NOW(), $3 FROM users WHERE users.username=$4;",
      [uuid, pattern_id, caption, username]
    );
  } catch (error) {
    console.log(error);
  }

  return res.status(201).json({ message: "Posted" });
}

async function editCaption(req, res) {
  const { post_id, caption } = req.body;

  try {
    await db.query("UPDATE posts SET caption = $1 WHERE post_id = $2;", [
      caption,
      post_id,
    ]);
  } catch (error) {
    console.log(error);
  }

  return res.status(200).json({ message: "Post edited" });
}

async function deletePost(req, res) {
  const { post_id } = req.body;

  let thisPost;

  try {
    thisPost = await db.query("DELETE FROM posts WHERE post_id = $1", [
      post_id,
    ]);
  } catch (error) {
    console.log(error);
  }

  if (!thisPost?.rows?.length)
    return res
      .status(400)
      .json({ message: "Post not found, please try again" });

  return res.status(200).json({ message: "Post deleted" });
}

module.exports = { getPosts, addPost, editCaption, deletePost };
