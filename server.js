const express = require("express");
const app = express();
const PORT = process.env.PORT || 2501;
const { verifyJWT } = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");

app.use(express.json());

app.use(cookieParser());

app.use("/register", require("./routes/register"));
app.use("/login", require("./routes/login"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));
app.use("/patterns", require("./routes/patterns"));

app.use("/comments", require("./routes/comments"));
app.use("/feed", require("./routes/feed"));

app.use(verifyJWT);

app.use("/users", require("./routes/following"));
app.use("/home", require("./routes/homepage"));
app.use("/likes", require("./routes/likes"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
