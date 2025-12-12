const query = require("../db/index.js");

async function getComments(req, res) {
  const { post_id } = req.params;

  let comments;

  try {
    comments = await query(
      "SELECT c.*, u.username FROM comments c JOIN users u ON c.user_id = u.user_id WHERE post_id = $1",
      [post_id]
    );
  } catch (error) {
    console.log(error);
  }

  return res.status(200).json(comments.rows);
}

async function addComment(req, res) {
  const { post_id, message } = req.body;
  const username = req.user;

  let doesCommentExist;

  try {
    doesCommentExist = await query(
      "SELECT * FROM comments WHERE post_id = $1 AND comment = $2 AND user_id = (SELECT user_id FROM users WHERE username = $3);",
      [post_id, message, username]
    );
    if (doesCommentExist.rows.length)
      return res
        .status(200)
        .json({ message: "Comment has already been posted" });

    await query(
      "INSERT INTO comments (user_id, comment, time, post_id) VALUES ((SELECT user_id FROM users WHERE username = $1), $2, NOW(), $3);",
      [username, message, post_id]
    );
  } catch (error) {
    console.log(error);
  }

  return res.status(200).json({ message: `You have commented on this post` });
}

async function removeComment(req, res) {
  const { post_id, comment } = req.body;
  const username = req.user;

  try {
    await query(
      "DELETE FROM comments WHERE post_id = $1 AND comment = $2 AND user_id = (SELECT user_id FROM users WHERE username = $3);",
      [post_id, comment, username]
    );
  } catch (error) {
    console.log(error);
  }

  return res.status(200).json({ message: `Comment has been deleted` });
}

module.exports = { getComments, addComment, removeComment };
