var createError = require('http-errors'),
    express = require('express'),
    path = require('path'),
    logger = require('morgan'),
    passport = require('passport'),
    Strategy = require('passport-local').Strategy,
    db = require('./db'),
    helmet = require('helmet'),
    flash = require('connect-flash'),
    //routes
    indexRouter = require('./routes/index'),
    //usersRouter = require('./routes/users'),
    loginRouter = require('./routes/login'),
    dataRouter = require('./routes/data'),
    user; 

passport.use(new Strategy(
  function(username, password, cb) {
    db.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));

  passport.serializeUser(function(user, cb) {
    cb(null, user.id);
  });
  
  passport.deserializeUser(function(id, cb) {
    db.users.findById(id, function (err, user) {
      if (err) { return cb(err); }
      cb(null, user);
    });
  });

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(require('express-session')({secret: 'keyboard cat', resave:false,saveUninitialized: false})); 
app.use(require('body-parser').urlencoded({extended:true}));

app.use(helmet()) // 1
app.use(passport.initialize()); // 2
app.use(passport.session());
app.use(express.static('public')); // 3
app.use(express.json()); // 4
app.use(logger('dev')); // 5

// routes
app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/data', dataRouter);
app.use('/data/add', dataRouter);
app.use('/data/update', dataRouter);
app.use('/data/delete', dataRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
