const express = require("express");
const connectDB = require("./config/db");

const app = express();

//connect database
connectDB();

// init middleware

app.use(express.json({ extended: false }));

app.get("/", (req, res) => res.send("API running"));

//define routes

app.use("/api/users", require("./routers/api/users"));
app.use("/api/profile", require("./routers/api/profile"));
app.use("/api/auth", require("./routers/api/auth"));
app.use("/api/posts", require("./routers/api/posts"));

const port = process.env.PORT || 5000;

app.listen(port, console.log(`server running at port ${port}`));
