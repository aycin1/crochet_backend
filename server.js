const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 2501;
const { verifyJWT } = require("./middleware/verifyJWT");
const cookieParser = require("cookie-parser");

const corsSettings = {
  origin: "http://localhost:3000",
  credentials: true,
  allowedHeaders: [
    "Access-Control-Allow-Origin",
    "Authorization",
    "Content-Type",
    "Accept",
    "Origin",
    "User-Agent",
  ],
};

app.use(express.json());
app.use(cors(corsSettings));
app.use(cookieParser());

app.use("/register", require("./routes/register"));
app.use("/login", require("./routes/login"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));
app.use("/patterns", require("./routes/patterns"));

// PUT VERIFY JWT HERE AFTER
app.use(verifyJWT);
app.use("/comments", require("./routes/comments"));
app.use("/feed", require("./routes/feed"));

app.use("/users", require("./routes/following"));
app.use("/home", require("./routes/homepage"));
app.use("/likes", require("./routes/likes"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
