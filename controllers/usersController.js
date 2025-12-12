const query = require("../db/index.js");

async function getUser(req, res) {
  const username = req.user;
  let thisUser;

  try {
    thisUser = await query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);
  } catch (error) {
    console.log(error);
  }

  if (thisUser?.rows?.length)
    return res.status(200).json(thisUser?.rows?.[0]?.username);
  else return res.sendStatus(404);
}

async function getUserPosts(req, res) {
  const { username } = req.query;

  let posts;

  try {
    posts = await query(
      "SELECT p.*, u.username FROM posts p INNER JOIN users u ON p.user_id = u.user_id WHERE u.username = $1 ORDER BY p.id DESC;",
      [username]
    );
  } catch (error) {
    console.log(error);
  }

  return res.status(200).json(posts?.rows);
}

async function handleUserSearch(req, res) {
  const { username } = req.params;

  let user;

  try {
    user = await query("SELECT * FROM users WHERE username = $1", [username]);
  } catch (error) {
    console.log(error);
  }

  if (!user?.rows?.length)
    return res
      .status(404)
      .json({ message: "No user found with that username, please try again" });
  return res.status(200).json({ username });
}

module.exports = { getUser, getUserPosts, handleUserSearch };
