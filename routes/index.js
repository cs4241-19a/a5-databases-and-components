var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

// Authentication Routes
// Show registration form
router.get("/register", (req, res) => {
  res.render("register");
});

// Handle sign up logic
router.post("/register", (req, res) => {
  var newUser = new User({username: req.body.username});
  User.register(newUser, req.body.password, (err, user) => {
    if(err) {
			console.log(err);
			return res.render("register", {"error": err.message});
    }
    passport.authenticate("local")(req, res, () => {
			req.flash("success", "Welcome to Marketplace Beta " + user.username);
      res.redirect("/items");
    });
  });
});

// Show Login form
router.get("/login", (req, res) => {
  res.render("login");
});

// Handle login logic
router.post("/login", passport.authenticate("local",
  {
    successRedirect: "/items",
    failureRedirect: "/login",
		failureFlash: true
  }), (req, res) => {
});

// Logout Route
router.get("/logout", (req, res) => {
  req.logout();
	req.flash("success", "Logged you out!");
  res.redirect("/items");
});

module.exports = router;
