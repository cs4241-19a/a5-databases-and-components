// server.js
// where your node app starts

// init project
const express = require('express'),
      app       = express(),
      session   = require( 'express-session' ),
      passport  = require( 'passport' ),
      Local     = require( 'passport-local' ).Strategy,
      bodyParser= require( 'body-parser' ),
      low       = require('lowdb'),
      FileSync  = require('lowdb/adapters/FileSync'),
      adapter   = new FileSync('.data/db.json'),
      db        = low(adapter),
      bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);

db.defaults({ comments: [], users: [] })
  .write()


app.use( express.static('./public') )
app.use(require('cookie-parser')());
app.use(require('body-parser').json());
app.use(require('express-session')({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

const isNotLoggedIn = function(req, res, next) {
  if (req.user === undefined) {
    next()
  } else {
    res.redirect('/home')
  }
}

const isLoggedIn = function(req, res, next) {
  if (req.user === undefined) {
    res.redirect('/')
  } else {
    next()
  }
}

// Modified rom lecture notes
// all authentication requests in passwords assume that your client
// is submitting a field named "username" and field named "password".
// these are both passed as arugments to the authentication strategy.
const myLocalStrategy = function( username, password, done ) {
  const users = db.get('users')
  
  // find the first item in our users array where the username
  // matches what was sent by the client. nicer to read/write than a for loop!
  const user = users.value().find( __user => __user.username === username )
  
  // if user is undefined, then there was no match for the submitted username
  if( user === undefined ) {
    /* arguments to done():
     - an error object (usually returned from database requests )
     - authentication status
     - a message / other data to send to client
    */
    return done( null, false, { message:'Incorrect username or password!' })
  }else if( bcrypt.compareSync(password, user.password) ) {
    // we found the user and the password matches!
    // go ahead and send the userdata... this will appear as request.user
    // in all express middleware functions.
    return done( null, { username, password })
  }else{
    // we found the user but the password didn't match...
    return done( null, false, { message: 'Incorrect username or password' })
  }
}

passport.use( new Local( myLocalStrategy ) )


passport.serializeUser( ( user, done ) => done( null, user.username ) )

// "name" below refers to whatever piece of info is serialized in seralizeUser,
// in this example we're using the username
passport.deserializeUser( ( username, done ) => {
  const user = db.get('users').value().find( u => u.username === username )
  console.log( 'deserializing:', username )
  
  if( user !== undefined ) {
    done( null, user )
  }else{
    done( null, false, { message:'user not found; session not restored' })
  }
})

app.post( 
  '/login',
  passport.authenticate( 'local' ),
  function( req, res ) {
      console.log("/login")
    if (undefined === req.user) {
      res.json({status: req.message})
    } else {
      res.redirect('/home')
    }
  }
)


app.post(
  '/signup',
  isNotLoggedIn,
  function( req, res ) {
    const requested_username = req.body.username
    const requested_password = req.body.password
    const users = db.get('users').value()
    
    if (undefined === users.find( __user => __user.username === requested_username )) {
      const hash = bcrypt.hashSync(requested_password, salt);
      const new_user = {
        "username": requested_username,
        "password": hash,
        "display_name": requested_username,
        "awards": []
      }
      
      db.get('users').push(new_user).write()
      
      res.json({ status:'success' })
    } else {
      res.json({ status:'failed' })
    }
  }
)




// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/home', isLoggedIn, function(reqeust, response) {
  response.sendFile(__dirname + '/views/home.html')
})

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
