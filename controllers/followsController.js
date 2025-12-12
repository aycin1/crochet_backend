const query = require("../db/index.js");

async function checkIfFollowing(req, res) {
  const { searchedUser } = req.query;
  const currentUser = req.user;

  let userSearch;

  try {
    userSearch = await query(
      "SELECT * FROM followings WHERE user_id = (SELECT user_id FROM users WHERE username = $1) AND following_id = (SELECT user_id FROM users WHERE username = $2);",
      [currentUser, searchedUser]
    );
  } catch (error) {
    console.log(error);
  }

  if (userSearch?.rows?.length) return res.status(200).json(true);
  return res.status(204).json(false);
}

async function handleFollowUser(req, res) {
  const { following_user } = req.body;
  const username = req.user;

  try {
    await query(
      "INSERT INTO followings (user_id, following_id) VALUES ((SELECT user_id FROM users WHERE username = $1),(SELECT user_id FROM users WHERE username = $2));",
      [username, following_user]
    );
  } catch (error) {
    console.log(error);
  }

  return res
    .status(200)
    .json({ message: `You are now following ${following_user}` });
}

async function handleUnfollowUser(req, res) {
  const { unfollowing_user } = req.body;
  const username = req.user;

  try {
    await query(
      "DELETE FROM followings WHERE user_id = (SELECT user_id FROM users WHERE username = $1) AND following_id = (SELECT user_id FROM users WHERE username = $2);",
      [username, unfollowing_user]
    );
  } catch (error) {
    console.log(error);
  }

  return res
    .status(200)
    .json({ message: `You have stopped following ${unfollowing_user}` });
}

async function getFollowCount(req, res) {
  const thisUser = req.user;

  let followers;
  let following;

  try {
    followers = await query(
      "SELECT u.username FROM users u JOIN followings f ON u.user_id = f.user_id WHERE f.following_id = (SELECT user_id FROM users WHERE username = $1);",
      [thisUser]
    );
    following = await query(
      "SELECT u.username FROM users u JOIN followings f ON u.user_id = f.following_id WHERE f.user_id = (SELECT user_id FROM users WHERE username = $1);",
      [thisUser]
    );
  } catch (error) {
    console.log(error);
  }

  const followerUsernames = followers?.rows?.map((user) => user.username);
  const followingUsernames = following?.rows?.map((user) => user.username);

  return res
    .status(200)
    .json([
      { followers: followerUsernames },
      { following: followingUsernames },
    ]);
}

module.exports = {
  checkIfFollowing,
  handleFollowUser,
  handleUnfollowUser,
  getFollowCount,
};
