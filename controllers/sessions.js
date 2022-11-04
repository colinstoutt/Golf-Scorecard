// this file will handle the literal logging in and logging out
// will fetch datat from database and create sessions

// Dependencies
const express = require("express");
const bcrypt = require("bcrypt");
const sessionsRouter = express.Router();
const User = require("../models/user.js");

// New Session (login page)
sessionsRouter.get("/new", (req, res) => {
  res.render("sessions/new.ejs", {
    currentUser: req.session.currentUser,
  });
});

// Delete Session(logout route)
sessionsRouter.delete("/", (req, res) => {
  req.session.destroy((error) => {
    res.redirect("/");
  });
});

// Create Session (login route)
sessionsRouter.post("/", (req, res) => {
  // Check for an existing user
  User.findOne(
    {
      email: req.body.email,
    },
    (error, foundUser) => {
      // send error message if no user is found
      if (!foundUser) {
        res.send(`Invalid email or password.`);
      } else {
        // If a user has been found
        // compare the given password with the hashed password we have stored
        // this will return a true or false
        const passwordMatches = bcrypt.compareSync(
          // password attempted to log in with
          req.body.password,
          // password in the database
          foundUser.password
        );

        // if the passwords match
        if (passwordMatches) {
          // add the user to our session
          req.session.currentUser = foundUser;

          //   ``` req.session.currentUser ``` =
          // {
          //     _id: new ObjectId("635d790424eccffda74a2d6e"),
          //     email: 'lucy@gmail.com',
          //     password: '$2b$10$VY16JrLgfa3I72OYiACY..Jzsw6KqUnvq/q/WPyy2./F6GRykHGlK',
          //     __v: 0
          //   }

          // redirect back to our home page
          res.redirect("/");
          //   res.send(`The current user is ${req.session.currentUser.email}`);
        } else {
          // if the passwords don't match
          res.send("Invalid email or password.");
        }
      }
    }
  );
});

// Export Sessions Router
module.exports = sessionsRouter;
