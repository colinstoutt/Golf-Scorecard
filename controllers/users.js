// Dependencies
const express = require("express");
const session = require("express-session");
const bcrypt = require("bcrypt");
const userRouter = express.Router();
const User = require("../models/user.js");
const Round = require("../models/round.js");

module.exports = userRouter;
// New (registration page)
userRouter.get("/new", (req, res) => {
  res.render("users/new.ejs", {
    currentUser: req.session.currentUser,
    tabTitle: "Register",
  });
});
// -=-delete user-=-
userRouter.delete("/:id", (req, res) => {
  User.findByIdAndRemove(req.params.id, (err, foundUser) => {
    const roundIds = [];
    for (let i = 0; i < foundUser.rounds.length; i++) {
      roundIds.push(foundUser.rounds[i]._id);
    }
    Round.remove(
      {
        _id: {
          $in: roundIds,
        },
      },
      (err, data) => {
        res.redirect("/users/new");
      }
    );
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
      res.redirect("/sessions/new");
    }
  });
});

// show
userRouter.get("/:id", (req, res) => {
  User.findById(req.params.id, (err, foundUser) => {
    res.render("users/show.ejs", {
      tabTitle: "Delete account",
      currentUser: req.session.currentUser,
    });
  });
});
