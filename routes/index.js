var express = require('express');
const dotenv = require('dotenv');
dotenv.config();
var router = express.Router();

// BEGIN AUTHENTICATION
var Auth0Strategy = require('passport-auth0');
var passport = require('passport');
var session = require('express-session');

router.use(session({ secret: "secret", cookie: { maxAge: 3600000 } }));

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

var strategy = new Auth0Strategy({
   domain:       'maccabi-trade.auth0.com',
   clientID:     process.env.AUTH0_CLIENT_ID,
   clientSecret: process.env.AUTH0_CLIENT_SECRET,
   callbackURL:  '/callback'
  },
  function(accessToken, refreshToken, extraParams, profile, done) {
    // accessToken is the token to call Auth0 API (not needed in the most cases)
    // extraParams.id_token has the JSON Web Token
    // profile has all the information from the user
    return done(null, profile);
  }
);

passport.use(strategy);
router.use(passport.initialize());
router.use(passport.session());
// END AUTHENTICATION

function dbGet(userID) {
  const Database = require('better-sqlite3');
  const db = new Database('bookings.db', {readonly: false});

  const stmt = db.prepare('SELECT * FROM reservations WHERE userID=?');
  return stmt.all(userID);
}

router.get('/callback',
  passport.authenticate('auth0', { failureRedirect: '/login' }),
  function(req, res) {
    if (!req.user) {
      throw new Error('user null');
    }
    res.redirect("/?alert=Logged+in");
  }
);

router.get('/login',
  passport.authenticate('auth0', {}), function (req, res) {
  res.redirect("/?alert=Welcome+back");
});

router.get('/logout',
  passport.authenticate('auth0', {}), function (req, res) {
  res.redirect("/");
});

/* GET home page. */
router.get('/', function(req, res) {
  let userID = 0;
  if (req.user) {
    userID = req.user.id;
    username = req.user.nickname;
  }
  else {
    res.redirect('/login')
  }
  let alert = "null"
  if (req.query.alert) {
    alert = req.query.alert;
  }
  let currentDate = new Date();
  currentDate = currentDate.toISOString().split('T')[0]
  res.render('index', { title: 'Booker', results: dbGet(userID), currentDate: currentDate, userID: userID, username: username, alert: alert });
});

module.exports = router;
