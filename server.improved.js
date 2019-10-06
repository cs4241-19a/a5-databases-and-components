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
  session = require('express-session'),
  mongoose = require('mongoose');

var credential = ''
mongoose.connect("mongodb+srv://andrewrm98:root@a5-mbizf.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true })
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {

  var userSchema = new mongoose.Schema({
    username: String,
    password: String,
  });

  var postSchema = new mongoose.Schema({
    id: Number,
    username: String,
    computer: String,
    game: String,
    fps: Number,
    gputemp: Number,
    cputemp: Number,
  })

  var countSchema = new mongoose.Schema({
    count: Number,
  })

  var User = mongoose.model('User', userSchema);
  var Post = mongoose.model('Post', postSchema);
  var Count = mongoose.model('Count', countSchema);

  passport.serializeUser((user, done) => {
    done(null, user.username)
  })

  // "name" below refers to whatever piece of info is serialized in seralizeUser,
  // in this example we're using the username
  passport.deserializeUser((username, done) => {
    var query = User.where({ username: username });

    query.findOne(function (err, user) {
      if (err) return handleError(err);
      if (user) {
        credential = username
        done(null, user)
      }
    });
  })

  app.use(express.static('./'))
  app.use(bodyParser.json())
  app.use(session({ secret: 'cats cats cats', resave: false, saveUninitialized: false }))
  app.use(passport.initialize())
  app.use(passport.session())

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
    if (credential != '') {
      Post.find({ username: credential }, function (err, arr) {
        if (err) return console.error(err)
        res.send(JSON.stringify(arr))
      });
    }
    else {
      Post.find(function (err, users) {
        if (err) return console.error(err);
        res.send(JSON.stringify(users))
      })
    }
  })

  // POST request to delete a row
  app.post('/deleterow', function (req, res) {
    let deleteID = req.body.id
    console.log(deleteID)
    Post.deleteOne({ id: deleteID }, function (err, del) {
      if(err) console.error(err)
      console.log("Document with ID: " + deleteID + " deleted")
      res.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
      res.end()
    })
  })

  // POST request to modify a row
  app.post('/modifyrow', function (req, res) {
    let body = req.body
    var doc = { computer: body.computer, game: body.game, fps: body.fps, gputemp: body.gputemp, cputemp: body.cputemp }

    Post.updateOne({ id: body.id }, doc, function (err, result) {
      if(err) console.error(err)
      console.log(result.nModified + " documents modified.")
      res.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
      res.end()
    })

  })

  // POST request for signing out
  app.post('/signout', function (req, res) {
    req.session.destroy()
    credential = ''
    res.redirect("/public/login.html")
    //res.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    res.end()
  })

  // POST request for the table information
  app.post('/submit', function (req, res) {
    let j = req.body
    // Increment the count for the id field (mongo already has an ID but this is how I did it before)
    Count.updateOne({ count: { $gt: -1 } }, { $inc: { count: 1 } }, function (err) {
      if (err) console.error(err)
      j.username = credential
      // Get the new count
      Count.findOne({ count: { $gt: -1 } }, function (err, temp) {
        if (err) console.error(err)
        j.id = temp.count
        // Create the post to be added
        var newPost = new Post(j)
        // Save the post to the database
        newPost.save(function (err) {
          console.log("Document added.")
          if (err) console.error(err)
          res.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
          res.end()
        })
      })
    })
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
  app.post('/signup', function (req, res) {
    const body = req.body
    let userAttempt = body.username
    let passAttempt = body.password

    // Add a post
    var newUser = new User({ username: userAttempt, password: passAttempt })
    newUser.save(function (err) {
      if (err) console.error(err)
      res.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
      res.end()
    })
  })

  // all authentication requests in passwords assume that your client
  // is submitting a field named "username" and field named "password".
  // these are both passed as arugments to the authentication strategy.
  const myLocalStrategy = function (username, password, done) {
    // find the first item in our users array where the username
    // matches what was sent by the client. nicer to read/write than a for loop!
    User.findOne({ username: username }, function (err, user) {
      if (err) console.error(err)
      // if user is undefined, then there was no match for the submitted username
      if (user === undefined) {
        /* arguments to done():
         - an error object (usually returned from database requests )
         - authentication status
         - a message / other data to send to client
        */
        console.log('user not found')
        return done(null, false, { message: 'user not found' })
      } else if (user.password === password) {
        // we found the user and the password matches!
        // go ahead and send the userdata... this will appear as request.user
        // in all express middleware functions.
        console.log('user found')
        return done(null, { username, password })
      } else {
        // we found the user but the password didn't match...
        console.log('password not found')
        return done(null, false, { message: 'incorrect password' })
      }
    })
  }
  passport.use(new Local(myLocalStrategy))

  app.post(
    '/login',
    passport.authenticate('local'),
    function (req, res) {
      res.json({ status: true })
    }
  )

  // Listen on port 3000
  app.listen(port, function () {
    console.log('Express Server running on port:3000, use localhost:3000 to connect')
  })
});


