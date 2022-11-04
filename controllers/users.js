// Dependencies
const express = require("express");
const bcrypt = require("bcrypt");
const userRouter = express.Router();
const User = require("../models/user.js");

module.exports = userRouter;
// New (registration page)
userRouter.get("/new", (req, res) => {
  res.render("users/new.ejs", {
    currentUser: req.session.currentUser,
    tabTitle: "Register",
  });
});

// -=-create-=-
userRouter.post("/", (req, res) => {
  console.log("Here is the form data", req.body);
  //overwrite the user password with the hashed password, then pass that in to our database
  req.body.password = bcrypt.hashSync(
    req.body.password,
    bcrypt.genSaltSync(10)
  );
  // actually adding the data to MongoDB Atlas
  User.create(req.body, (err, createdUser) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});
