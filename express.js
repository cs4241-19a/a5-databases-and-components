const express = require('express'),
      app = express(),
      Local = require('passport-local').Strategy,
      passport = require('passport'),
      session = require('express-session'),
      bodyParser = require('body-parser'),
      port = 3000,
      path = require('path'),
      dir = ".//"

var credential = null

app.use( session({ secret:'cats cats cats', resave:false, saveUninitialized:false }) )
app.use(passport.initialize())
app.use(passport.session());

// all authentication requests in passwords assume that your client
// is submitting a field named "username" and field named "password".
// these are both passed as arugments to the authentication strategy.
const myLocalStrategy = function( username, password, done ) {
  // find the first item in our users array where the username
  // matches what was sent by the client. nicer to read/write than a for loop!
  //const user = users.find( __user => __user.username === username )
  const user = userdb.get('users').find({username: username}).value()

  // if user is undefined, then there was no match for the submitted username
  if( user === undefined ) {
    /* arguments to done():
     - an error object (usually returned from database requests )
     - authentication status
     - a message / other data to send to client
    */
    return done( null, false, { message:'user not found' })
  }else if( user.password === password ) {
    credentials = username
    // we found the user and the password matches!
    // go ahead and send the userdata... this will appear as request.user
    // in all express middleware functions.
    return done( null, { username, password })
  }else{
    // we found the user but the password didn't match...
    return done( null, false, { message: 'incorrect password' })
  }
}

// specify parser
app.use(bodyParser .json());

// Uses the css and javascript files
app.use(express.static(__dirname + '/public'))

// GET request for index.html
app.get('/', (req, res) => res.sendFile(__dirname + '/public/login.html'))

// GET request for login.html
app.get('/login', (req, res) => res.sendFile(__dirname + '/public/login.html'))

//get request for index
app.get('/home', (req, res) => res.sendFile(__dirname + '/public/home.html'))

// GET request for the table data
app.get('/tabledata', (req, res) => res.send(expensedb.get('posts').filter({username: credentials}).values()))

// POST request for login
passport.use( new Local( myLocalStrategy ) )

app.post( 
  '/login',
  passport.authenticate( 'local', { successRedirect: '/home', failureRedirect: '/' }), 
  function( req, res ) {
    console.log(req.user)
    res.json({ status:true })
    req.on('end', function() { 
      // load data for user and change webpage
    })
  })

  // POST request for signing out
app.post('/signout', function(req, res) {
  req.session.destroy()
  credential = ''
  
  res.redirect("/login.html")
  // /res.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
  res.end()
})
  
// POST request for deleting database
app.post('/deleteRow', function(req, res) {
  let deleteIndex = req.body
  expensedb.get('posts').remove({index: deleteIndex.id}).write()

  res.writeHead(200, "OK", {'Content-Type': 'application/json' })
  res.end()

  console.log("deleted an entry")
})


// POST request for modifying database
app.post('/modifyRow', function(req, res) {
    let entry = req.body
    
    var amt = entry.amount
    var cat = entry.category
    var mon = entry.month
    var index = entry.index

    // replace existing entry from server
    expensedb.get('posts')
             .find({index: index})
             .assign({amount: amt, category: cat, month: mon})
             .write()

    console.log("updated an entry")
    res.writeHead(200, "OK", {'Content-Type': 'text/plain' })
    res.end()
})


// POST request for table data
app.post('/submit', function(req, res) {
        let data = req.body
    
        var amt = data.amount
        var cat = data.category
        var mon = data.month
        var index = expensedb.get('count').value()

        // Increment count
        expensedb.update('count', n => n + 1)
                  .write()
        
        obj = {index: index, amount: amt, category: cat, month: mon, username: credentials}
        console.log(obj)

        // add to database
        expensedb.get('posts')
        .push(obj)
        .write()
      

        res.writeHead( 200, "OK", {'Content-Type': 'application/json' })
        res.end()
})

// POST request for logging in
app.post('/signup', function(req, res) {
    const body = req.body

    var user = body.username
    var pass = body.password

    // Add a post
    userdb.get('users')
          .push({ username: user, password: pass })
          .write()

    res.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
    res.end()
})

passport.serializeUser( ( user, done ) => done( null, user.username ) )

// "name" below refers to whatever piece of info is serialized in seralizeUser,
// in this example we're using the username
passport.deserializeUser( ( username, done ) => {
  const user = userdb.find( u => u.username === username )
  console.log( 'deserializing:', username )
  credential = username
  
  if( user !== undefined ) {
    done( null, user )
  }else{
    done( null, false, { message:'user not found; session not restored' })
  }
})

// set up low db 
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

// database for spreadsheets
const adapter = new FileSync('db.json')
const expensedb = low(adapter)

const adapter2 = new FileSync('users.json')
const userdb = low(adapter2)


// Set some defaults (required if your JSON file is empty)
expensedb.defaults({ posts: [], count: 0})
  .write()

userdb.defaults({ users: [] }) 
  .write()

app.listen( process.env.PORT || 3000 )