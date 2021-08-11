const express = require("express");
const passport = require("passport");
const cors = require("cors");
const routes = require("../routes");
const path = require("path");
const db = require("../database/config");
require("../database/config");
require("../config/passport")(passport);

const server = express();
server.use(express.json({ limit: "20gb" }));
server.use(express.urlencoded({ extended: true }));

server.use(passport.initialize());

server.use(cors());

server.get("/", (req, res) => {
  res.send("<h1>Welcome to Sentimeter API</h1>");
});
server.use("/api", routes);
server.use("/static", express.static(path.join(__dirname, "..", "static")));

db.authenticate()
  .then(() => console.log("Database connected..."))
  .catch((error) => console.log(error));

db.sync({ force: false });

module.exports = server;
