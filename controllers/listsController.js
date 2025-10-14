const fsPromises = require("fs").promises;
const path = require("path");
const data = {
  lists: require("../model/lists.json"),
  setLists: function (data) {
    this.lists = data;
  },
};

async function getLists(req, res) {
  const username = req.user;

  const wishlist = data.lists.filter(
    (pattern) =>
      pattern.list === "wishlist" && pattern.username === `${username}`
  );
  const inProgress = data.lists.filter(
    (pattern) => pattern.list === "wip" && pattern.username === `${username}`
  );
  const completed = data.lists.filter(
    (pattern) =>
      pattern.list === "completed" && pattern.username === `${username}`
  );
  // const ownPatterns = data.lists.filter(
  //   (pattern) =>
  //     pattern.list === "own_pattern" && pattern.username === `${username}`
  // );
  return await res.status(201).json({
    wishlist: wishlist,
    wip: inProgress,
    completed: completed,
    // ownPatterns: ownPatterns,
  });
}

async function handlePatternAddition(req, res) {
  const { pattern_id, list } = req.body;
  const username = req.user;

  const newPattern = {
    pattern_id: parseInt(pattern_id),
    username: username,
    list: list,
  };

  data.setLists([...data.lists, newPattern]);

  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "lists.json"),
    JSON.stringify(data.lists)
  );

  return await res
    .status(201)
    .json({ message: `Pattern has been added to your ${list}` });
}

async function handleListChange(req, res) {
  const { pattern_id, list } = req.body;
  const username = req.user;

  try {
    const currentPattern = data.lists.find((list) => {
      return (
        list.username === username &&
        parseInt(list.pattern_id) === parseInt(pattern_id)
      );
    });

    const notPattern = data.lists.filter(
      (list) =>
        (list.username !== currentPattern.username &&
          parseInt(list.pattern_id) !== parseInt(currentPattern.pattern_id)) ||
        (list.username === currentPattern.username &&
          parseInt(list.pattern_id) !== parseInt(currentPattern.pattern_id))
    );
    const currentUpdate = { ...currentPattern, list: list };
    data.setLists([...notPattern, currentUpdate]);

    await fsPromises.writeFile(
      path.join(__dirname, "..", "model", "lists.json"),
      JSON.stringify(data.lists)
    );

    return await res
      .status(201)
      .json({ message: `Pattern has been moved to your ${list}` });
  } catch (error) {
    console.log(error);
  }
}

async function handlePatternDeletion(req, res) {
  const { pattern_id } = req.body;
  const username = req.user;

  const patternsToKeep = data.lists.filter((pattern) => {
    return !(
      pattern.username === username &&
      parseInt(pattern.pattern_id) === parseInt(pattern_id)
    );
  });

  data.setLists(patternsToKeep);

  await fsPromises.writeFile(
    path.join(__dirname, "..", "model", "lists.json"),
    JSON.stringify(data.lists)
  );

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
