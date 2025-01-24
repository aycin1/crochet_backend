const bcrypt = require("bcrypt");
const data = {
  users: require("./../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};

async function registerNewUser(req, res) {
  const { first_name, last_name, email, username, password } = req.body;

  if (!first_name || !last_name || !email || !username || !password) {
    return res
      .status(400)
      .json({ message: "Please complete all fields to register" });
  }

  const checkEmail = () => {
    return data.users.filter((user) => user.email === email);
  };
  if (checkEmail().length) {
    return res.status(400).json({
      message: "An account for this email address exists, please sign in",
    });
  }

  const checkUsername = () => {
    return data.users.filter((user) => user.username === username);
  };
  if (checkUsername().length) {
    return res.status(400).json({
      message: "This username has been taken, please try a different one",
    });
  }

  const hashedPassword = bcrypt.hash(password, 10);
  const newUser = {
    first_name: first_name,
    last_name: last_name,
    email: email,
    username: username,
    hashed_password: await hashedPassword,
  };

  data.setUsers([...data.users, newUser]);
  return res.status(201).json(data.users);
}

module.exports = { registerNewUser };
