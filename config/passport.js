const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'Could not find the email!' });
        }

        // Learned how to do password check using bcrypt
        bcrypt.compare(password, user.password, (err, match) => {
          if (err) throw err;
          if (match) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Invalid username or password.' });
          }
        });
      });
    })
  );
  
  // Serialize users (taken from passportjs.org link)
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};
