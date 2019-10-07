// server.js
// where your node app starts

// init project
const express = require('express');
const app = express();
const passport = require('passport');
const errorhandler = require('errorhandler');
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


if (process.env.NODE_ENV === 'development') {
  // only use in development
  app.use(errorhandler())
}


const apiRouter = require('./api');

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieSession({
  name: 'session',
  keys: ['thatisallright'],
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

app.use('/api', apiRouter);

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/dashboard', function (request, response) {
  response.sendFile(__dirname + '/views/dashboard.html');
});

app.use(passport.initialize());
app.use(passport.session());

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
