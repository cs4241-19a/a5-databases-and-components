var low = require('lowdb');
var uuid = require('uuid');
var LocalStrategy   = require('passport-local').Strategy;
var passport = require('passport');
var bcrypt = require('bcryptjs');
var path = require('path');


var db = low(path.join('data', 'db.json'));

//This encrypts the password
function creatPassword(password) {
  var s = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(password, s);
}
function comparePassword(password, creatPassword) {
  return bcrypt.compareSync(password, creatPassword);
}

exports.signup = function signup(options, res) {
  var users = db.get('users').map('username').value()
  var userExists = users.includes(options.username)
  if (userExists) {
    return res.render(options.signUpTemplate, {errors: ['This user already exists']})
  } else {
    db.get('users')
      .push({
        username: options.username,
        id: uuid(), //make an ID number
        password: creatPassword(options.password),
        songs: []
      })
      .write()
    res.redirect(options.successRedirectUrl)
  }
}

exports.configurePassport = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    var user = db.get('users').find({id: id}).value()
    if(!user) {
      done({ message: 'Invalid attributes.' }, null);
    } else {

      done(null, {id: user.id, username: user.username})
    }


  });

  passport.use(new LocalStrategy(
    
    function(username, password, done) {
      var user = db.get('users').find({ username: username }).value()
      if(!user) {

        return done(null, false, { message: 'User Not Found' });
      }
      var match = comparePassword(password, user.password);
      if(!match) {
        return done(null, false, { message: 'Password Invalid' });
      }
      return done(null, user)
    }

  ));
}
