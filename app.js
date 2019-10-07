const express   = require( 'express' ),
      expressLayouts = require('express-ejs-layouts'),
      app       = express(),
      session   = require( 'express-session' ),
      passport  = require( 'passport' ),
      flash = require('connect-flash'),
      mongoose  = require( 'mongoose'),
      db = require('./config/keys').mongo,
      bodyParser= require( 'body-parser' );


require('./config/passport')(passport);

// MongoDB using Mongoose
mongoose.connect(db, { useUnifiedTopology:true, useNewUrlParser: true })
  .then(() => console.log("DB connection established.."))
  .catch(err => console.log("Error: " + err)); 

// Using ejs and ejs layout method
app.use(expressLayouts);
app.set('view engine', 'ejs');

// Ejs cannot do <form action="" method="DELETE" or method="PUT"
// It needed this
const methodOverride = require('method-override')
 
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // look in urlencoded POST bodies and delete it
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

app.use(express.urlencoded({ extended: false }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// For Pop-ups
app.use(function(req, res, next) {
  res.locals.success = req.flash('success');
  res.locals.error_message = req.flash('error_message');
  res.locals.error_indicator = req.flash('error');
  next();
});

// Direct to Routers
app.use('/', require('./routes/home.js'));
app.use('/users', require('./routes/users.js'));


app.listen( process.env.PORT || 3000 )