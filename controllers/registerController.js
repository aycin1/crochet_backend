function registerNewUser(req, res) {
  const { first_name, last_name, email, username, password } = req.body;

  if (!first_name || !last_name || !email || !username || !password) {
    res.status().json({ message: "Please complete all fields to register" });
  }

  const checkDuplicates = () => {
    
  }
}

module.exports = { registerNewUser };
