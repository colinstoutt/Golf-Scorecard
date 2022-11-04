// Dependencies
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const methodOverride = require("method-override");
// bcrypt
const bcrypt = require("bcrypt");
const hashedString = bcrypt.hashSync(
  "yourPasswordStringHere",
  bcrypt.genSaltSync(10)
);

// .env connect
require("dotenv").config();
const PORT = process.env.PORT;

// mongoose connect
mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// mongoose connection status messages
const db = mongoose.connection;
db.on("error", (err) => console.log(err.message + " is mongod not running?"));
db.on("connected", () => console.log("mongo connected"));
db.on("disconnected", () => console.log("mongo disconnected"));

// middleware

app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(methodOverride("_method"));

// routes / controlelrs
const userController = require("./controllers/users");
app.use("/users", userController);

const sessionsController = require("./controllers/sessions");
app.use("/sessions", sessionsController);

// Routes / Controllers
// app.get("/", (req, res) => {
//   res.render("index.ejs", {
//     currentUser: req.session.currentUser,
//   });
// });

app.get("/", (req, res) => {
  if (req.session.currentUser) {
    res.render("dashboard.ejs", {
      currentUser: req.session.currentUser,
    });
  } else {
    res.render("index.ejs", {
      currentUser: req.session.currentUser,
    });
  }
});

// listener
app.listen(PORT, () => console.log(`server is listening on port: ${PORT}`));
