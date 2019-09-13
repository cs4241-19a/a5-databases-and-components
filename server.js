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


app.use( express.static('./') )
app.use( bodyParser.json() )

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
  const user = users.find( __user => __user.username === username )
  
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
passport.initialize()

app.post( 
  '/login',
  passport.authenticate( 'local' ),
  function( req, res ) {
    console.log( 'user:', req.user )
    res.redirect('home')
  }
)


app.post(
  '/signup',
  isNotLoggedIn,
  function( req, res )
)




// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
