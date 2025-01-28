const express = require("express");
const app = express();
const PORT = process.env.PORT || 2501;
const { verifyJWT } = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");

app.use(express.json());

app.use(cookieParser());

app.use("/register", require("./routes/register"));
app.use("/login", require("./routes/login"));
app.use("/patterns", require("./routes/patterns"));

app.use(verifyJWT);

app.use("/home", require("./routes/homepage"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
