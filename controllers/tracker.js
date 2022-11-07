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
trackerRouter.delete("/:id", (req, res) => {
  Round.findByIdAndRemove(req.params.id, () => {
    User.findOne({ "rounds._id": req.params.id }, (err, foundUser) => {
      foundUser.rounds.id(req.params.id).remove();
      foundUser.save((err, data) => {
        res.redirect("/tracker");
      });
    });
  });
});

// // update
trackerRouter.put("/:id", (req, res) => {
  Round.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, updatedRound) => {
      User.findOne({ "rounds._id": req.params.id }, (err, foundUser) => {
        foundUser.rounds.id(req.params.id).remove();
        foundUser.rounds.push(updatedRound);
        foundUser.save((err, data) => {
          res.redirect("/tracker/" + req.params.id);
        });
      });
    }
  );
});

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
trackerRouter.get("/:id/edit", (req, res) => {
  Round.findById(req.params.id, (err, foundRound) => {
    res.render("rounds/edit.ejs", {
      currentUser: req.session.currentUser,
      round: foundRound,
      par: foundRound.par,
      score: foundRound.score,
      tabTitle: "Edit",
    });
  });
});

// show
trackerRouter.get("/:id", (req, res) => {
  Round.findById(req.params.id, (err, foundRound) => {
    User.findOne({ "rounds._id": req.params.id }, (err, foundUser) => {
      res.render("rounds/show.ejs", {
        tabTitle: foundRound.course,
        round: foundRound,
        currentUser: foundUser,
        par: foundRound.par,
        score: foundRound.score,
      });
    });
  });
});

module.exports = trackerRouter;
