var express = require('express');
var passport = require('passport');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');

var store = require('connect-nedb-session')(session);
var expressLayouts = require('express-ejs-layouts');

var path = require('path');
var flash = require('connect-flash');


var serverSide = require('./serverSide');
var reaction = require('./views/reaction');

var app = express();
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 
app.use(expressValidator());
app.use(cookieParser());

var sess = {
  store: new store({ filename: path.join('data', 'sessionFile.json')}),
  secret: 'secret',
  cookie: {},
  resave: false,
  saveUninitialized: false,
}
app.use(session(sess))

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use('/css', express.static('css'));

app.use(function(req, res, next) {
  res.locals.errors = null;
  res.locals.user = req.user || null;
  res.locals.error = req.flash('error')
  res.locals.success = req.flash('success')
  next();
})


app.use('/', serverSide);






app.listen(3000, function(){
  console.log('server on port 3000')
})
