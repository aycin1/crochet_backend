const express = require("express");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const { verifyJWT } = require("./middleware/verifyJWT");
const PORT = process.env.PORT || 2501;
const app = express();
app.use(express.json());
app.use(cookieParser());

const corsSettings = {
  allowedHeaders: [
    "Access-Control-Allow-Origin",
    "Authorization",
    "Content-Type",
    "Origin",
    "Accept",
    "User-Agent",
  ],
  credentials: true,
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  origin: [
    "https://fibre-fantasies-7qzhj1kxo-aycins-projects-b5add123.vercel.app",
    "http://localhost:5173",
  ],
};

app.use(cors(corsSettings));

app.use("/register", require("./routes/register"));
app.use("/login", require("./routes/login"));
app.use("/refresh", require("./routes/refresh"));
app.use("/logout", require("./routes/logout"));
app.use("/patterns", require("./routes/patterns"));

app.use(verifyJWT);

app.use("/feed", require("./routes/feed"));
app.use("/users", require("./routes/users"));
app.use("/follows", require("./routes/follows"));
app.use("/lists", require("./routes/lists"));
app.use("/likes", require("./routes/likes"));
app.use("/comments", require("./routes/comments"));
app.use("/ik-auth", require("./routes/ik-auth"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
