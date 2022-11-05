const express = require("express");
const trackerRouter = express.Router();
const session = require("express-session");
const Round = require("../models/round.js");
const User = require("../models/user.js");

// index/dashboard
trackerRouter.get("/", (req, res) => {
  if (req.session.currentUser) {
    User.findById(req.session.currentUser, (err, foundUser) => {
      res.render("rounds/dashboard.ejs", {
        rounds: foundUser.rounds,
        currentUser: foundUser,
        tabTitle: "Dashboard",
      });
    });
  } else {
    res.render("rounds/index.ejs", {
      currentUser: req.session.currentUser,
      tabTitle: "Log In",
    });
  }
});

// new
trackerRouter.get("/new", (req, res) => {
  res.render("rounds/new.ejs", {
    currentUser: req.session.currentUser,
    tabTitle: "Add Round",
  });
});

// delete

// update

// create
trackerRouter.post("/", (req, res) => {
  User.findById(req.session.currentUser, (err, foundUser) => {
    Round.create(req.body, (err, createdRound) => {
      foundUser.rounds.push(createdRound);
      foundUser.save((err, data) => {
        res.redirect("/tracker");
      });
    });
  });
});

// edit

// show

module.exports = trackerRouter;
