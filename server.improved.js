const express = require('express'),
    app = express(),
    port = 3000,
    path = require('path'),
    dir = ".//",
    low = require('lowdb'),
    FileSync = require('lowdb/adapters/FileSync'),
    passport = require('passport'),
    Local = require('passport-local').Strategy,
    bodyParser = require('body-parser'),
    session = require('express-session')

const userAdapter = new FileSync('users.json')
const dataAdapter = new FileSync('datadb.json')
const userdb = low(userAdapter)
const datadb = low(dataAdapter)

passport.serializeUser( ( user, done ) => {
    done( null, user.username ) 
})

// "name" below refers to whatever piece of info is serialized in seralizeUser,
// in this example we're using the username
passport.deserializeUser( ( username, done ) => {
  const user = userdb.find( u => u.username === username ).value()
  credential = username
  
  if( user !== undefined ) {
    done( null, user )
  }else{
    done( null, false, { message:'user not found; session not restored' })
  }
})


app.use( express.static('./') )
app.use( bodyParser.json() )
app.use(session({ secret: 'cats cats cats', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())

// Set some defaults (required if your JSON file is empty)
userdb.defaults({ users: [] })
  .write()

// Set some defaults (required if your JSON file is empty)
datadb.defaults({ posts: [], count: 0 })
  .write()

  let credential = ''

// Uses the css and javascript files
app.use(express.static(__dirname + '/public'))

// GET request for index.html
app.get('/', (req, res) => res.sendFile(__dirname + '/public/index.html'))

// GET request for login.html
app.get('/redirect-login', (req, res) => res.sendFile(__dirname + '/public/login.html'))

// GET request for signup.html
app.get('/redirect-signup', (req, res) => res.sendFile(__dirname + '/public/signup.html'))

// GET request for the table-contents
app.get('/table-contents', function (req, res) { 
  console.log(req.user)
    if( credential != '') {
        res.send(JSON.stringify(datadb.get('posts')
                                      .filter( { username: credential } )
                                      .values()))
    }
    else {
        res.send(JSON.stringify(datadb.get('posts').values()))
    }
})

// POST request to delete a row
app.post('/deleterow', function(req, res) {
  let deleteID = req.body
  datadb.get('posts').remove({ id: deleteID.id }).write()

  res.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
  res.end()
})

// POST request to modify a row
app.post('/modifyrow', function(req, res) {
  let body = req.body
  datadb.get('posts').find({ id: body.id }).assign({ computer: body.computer, game: body.game, fps: body.fps, gputemp: body.gputemp, cputemp: body.cputemp }).write()

  res.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
  res.end()
})

// POST request for signing out
app.post('/signout', function(req, res) {
    req.session.destroy()
    credential = ''
    res.redirect("/public/login.html")
    //res.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    res.end()
})

// POST request for the table information
app.post('/submit', function(req, res) {
  if (credential != '') {
    let j = req.body
    datadb.update('count', n => n + 1).write()
    j.username = credential
    j.id = datadb.get('count').value()
    datadb.get('posts')
      .push(j)
      .write()
  }
  res.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
  res.end()
})

app.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/redirect-login'
}),
    function (req, res) {
        res.json({ status: true })
    }
  )

// POST request for logging in
app.post('/signup', function(req, res) {
  const body = req.body
  let userAttempt = body.username
  let passAttempt = body.password

  // Add a post
  userdb.get('users')
    .push({ username: userAttempt, password: passAttempt })
    .write()

  res.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
  res.end()
})

  // all authentication requests in passwords assume that your client
// is submitting a field named "username" and field named "password".
// these are both passed as arugments to the authentication strategy.
const myLocalStrategy = function( username, password, done ) {
    // find the first item in our users array where the username
    // matches what was sent by the client. nicer to read/write than a for loop!
    const user = userdb.get( 'users' )
                       .find({ username: username})
                       .value()
    
    // if user is undefined, then there was no match for the submitted username
    if( user === undefined ) {
      /* arguments to done():
       - an error object (usually returned from database requests )
       - authentication status
       - a message / other data to send to client
      */
     console.log('user not found')
      return done( null, false, { message:'user not found' })
    }else if( user.password === password ) {
      // we found the user and the password matches!
      // go ahead and send the userdata... this will appear as request.user
      // in all express middleware functions.
      console.log('user found')
      return done( null, { username, password })
    }else{
      // we found the user but the password didn't match...
      console.log('password not found')
      return done( null, false, { message: 'incorrect password' })
    }
}
passport.use(new Local(myLocalStrategy))

  app.post( 
    '/login',
    passport.authenticate( 'local' ),
    function( req, res ) {
      res.json({ status:true })
    }
  )

// Listen on port 3000
app.listen (port, function () {
    console.log('Express Server running on port:3000, use localhost:3000 to connect')
})
