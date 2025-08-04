const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
require("dotenv").config();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const http = require("http");
const server = http.createServer(app);

const mongoose = require("mongoose");

const url = process.env.USER_ID;
mongoose.connect(url).then(() => {
  console.log("mongoose done.");
});

const userRouter = require("./routes/users.route");
const generateRouter = require("./routes/generates.route");
app.use("/api", userRouter);
app.use("/api", generateRouter);

server.listen(4000, () => {
  console.log("server running");
});
