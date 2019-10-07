const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const passport = require('passport');
const { shallPass } = require('../config/auth');

router.get('/login', shallPass, (req, res) => res.render('login'));
router.get('/signup', shallPass, (req, res) => res.render('signup'));

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'You are logged out.');
  res.redirect('/users/login');
});

// Login
router.post('/login', (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/users/login',
    failureFlash: true
  })(req, res, next);
});

router.post('/signup', (req, res) => {
  
  const { name, email, password, password2 } = req.body;
  let errors = [];
  
  // Checks specific invalid password cases and fills an errors buffer
  if (!name || !email || !password || !password2) {
    errors.push({ msg: 'Enter all fields.' });
  }

  if (password != password2) {
    errors.push({ msg: 'Passwords do not match.' });
  }
  
  if (password.length < 6) {
    errors.push({ msg: 'Password must be at least 6 characters.' });
  }
  
  if (errors.length > 0) {
    res.render('signup', {
      errors,
      name,
      email,
      password,
      password2
    });
  } else {
    User.findOne({ email: email }).then(user => {
      if (user) {
        errors.push({ msg: 'This email already exists!' });
        res.render('signup', {
          errors,
          name,
          email,
          password,
          password2
        });
      } else {
        const newUser = new User({
          name,
          email,
          password
        });
        
        // Hash the password using bcrypt and save the new user to DB
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success',
                  'You are now registered!'
                );
                res.redirect('/users/login');
              })
              .catch(err => console.log(err));
          });
        });
      }
    });
  }
  
});

module.exports = router;