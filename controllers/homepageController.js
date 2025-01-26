const data = {
  lists: require("./../model/lists.json"),
  setLists: function (data) {
    this.lists = data;
  },
};

function listsForCurrentUser(username) {
  return data.lists.filter((list) => list.username === username);
}

async function getLists(req, res) {
  const username = req.params.username;

  const wishlist = data.lists.filter(
    (pattern) =>
      pattern.list === "wishlist" && pattern.username === `${username}`
  );
  const wip = data.lists.filter(
    (pattern) => pattern.list === "wip" && pattern.username === `${username}`
  );
  const completed = data.lists.filter(
    (pattern) =>
      pattern.list === "completed" && pattern.username === `${username}`
  );
  const ownPatterns = data.lists.filter(
    (pattern) =>
      pattern.list === "own_pattern" && pattern.username === `${username}`
  );

  return await res.status(201).json({
    wishlist: wishlist,
    wip: wip,
    completed: completed,
    ownPatterns: ownPatterns,
  });
}

async function handlePatternAddition(req, res) {
  const { username, pattern_id, list } = req.body;

  const newPattern = {
    pattern_id: pattern_id,
    username: username,
    list: list,
  };

  data.setLists([...data.lists, newPattern]);

  return await res.status(201).json(listsForCurrentUser(username));
}

async function handleListChange(req, res) {
  const { username, pattern_id, list } = req.body;

  try {
    const currentPattern = data.lists.find((list) => {
      return list.username === username && list.pattern_id === pattern_id;
    });

    const notPattern = data.lists.filter(
      (list) =>
        (list.username !== currentPattern.username &&
          list.pattern_id !== currentPattern.pattern_id) ||
        (list.username === currentPattern.username &&
          list.pattern_id !== currentPattern.pattern_id)
    );
    const currentUpdate = { ...currentPattern, list: list };
    data.setLists([...notPattern, currentUpdate]);

    return await res.status(201).json(listsForCurrentUser(username));
  } catch (error) {
    console.log(error);
  }
}

async function handlePatternDeletion(req, res) {
  const { username, pattern_id, list } = req.body;

  const patternsToKeep = data.lists.filter((pattern) => {
    return !(
      pattern.username === username &&
      pattern.pattern_id === pattern_id &&
      pattern.list === list
    );
  });

  data.setLists(patternsToKeep);

  return await res.status(201).json(listsForCurrentUser(username));
}

module.exports = {
  getLists,
  handlePatternAddition,
  handleListChange,
  handlePatternDeletion,
};
