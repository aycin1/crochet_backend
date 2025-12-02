const db = require("../db/index.js");

async function getLists(req, res) {
  const username = req.user;

  let listsQuery;
  let patternQuery;

  try {
    listsQuery = await db.query(
      "SELECT name FROM lists WHERE user_id = (SELECT user_id FROM users WHERE username = $1);",
      [username]
    );
    patternQuery = await db.query(
      "SELECT p.pattern_id, l.name FROM patterns p JOIN lists l ON p.list_id = l.list_id WHERE l.user_id = (SELECT user_id FROM users WHERE username = $1);",
      [username]
    );
  } catch (error) {
    console.log(error);
  }

  const lists = listsQuery.rows.map((list) => {
    const patterns = patternQuery.rows.filter((row) => row.name === list.name);
    return { name: list.name, patterns };
  });

  return await res.status(201).json(lists);
}

async function handlePatternAddition(req, res) {
  const { pattern_id, list } = req.body;
  const username = req.user;

  let addPattern;

  try {
    addPattern = await db.query(
      "INSERT INTO patterns (pattern_id, user_id, list_id) SELECT $1, l.user_id, l.list_id FROM lists l JOIN users u ON l.user_id = u.user_id WHERE l.list_id = (SELECT list_id FROM lists l WHERE l.name = $2 AND l.user_id = (SELECT user_id FROM users WHERE username = $3));",
      [pattern_id, list, username]
    );
  } catch (error) {
    console.log(error);
  }

  return await res
    .status(201)
    .json({ message: `Pattern has been added to your ${list}` });
}

async function handleListChange(req, res) {
  const { pattern_id, list } = req.body;
  const username = req.user;

  let changeList;

  try {
    changeList = await db.query(
      "UPDATE patterns SET list_id = lists.list_id FROM lists, users WHERE patterns.pattern_id = $1 AND users.username = $2 AND lists.name = $3;",
      [pattern_id, username, list]
    );
  } catch (error) {
    console.log(error);
  }

  return await res
    .status(201)
    .json({ message: `Pattern has been moved to your ${list}` });
}

async function handlePatternDeletion(req, res) {
  const { pattern_id } = req.body;
  const username = req.user;

  try {
    await db.query(
      "DELETE FROM patterns USING users WHERE patterns.user_id = users.user_id AND patterns.pattern_id = $1 AND users.username = $2;",
      [pattern_id, username]
    );
  } catch (error) {
    console.log(error);
  }

  return await res
    .status(201)
    .json({ message: `Pattern has been removed from your lists` });
}

module.exports = {
  getLists,
  handlePatternAddition,
  handleListChange,
  handlePatternDeletion,
};
