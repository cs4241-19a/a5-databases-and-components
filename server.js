// init project
const express = require('express'),
  favicon = require('serve-favicon'),
  mongodb = require('mongodb')
  app = express(),
  bodyparser = require( 'body-parser' ),
  session   = require( 'express-session' ),
  passport  = require( 'passport' ),
  Local     = require( 'passport-local' ).Strategy
  cookieParser = require('cookie-parser')
  dotenv = require('dotenv')

dotenv.config()
const uri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+'/'+process.env.DB
const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })

app.use(favicon(__dirname + '/favicon.ico'))
app.use(express.static('./'));
app.use(cookieParser())
app.use( session({ secret:'cats', resave:false, saveUninitialized:false }) )
app.use(passport.initialize())
app.use(passport.session())
app.use( bodyparser.json() )


let users = null
let notes = null

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'Note-Keeper-DB' ).createCollection( 'Users' )
  })
  .then( __users => {
    // store reference to collection
    users = __users
    // blank query returns all documents
    return users.find({ }).toArray()
  })

client.connect()
.then( () => {
  // will only create collection if it doesn't exist
  return client.db( 'Note-Keeper-DB' ).createCollection( 'Notes' )
})
.then( __notes => {
  // store reference to collection
  notes = __notes
  // blank query returns all documents
  return notes.find({ }).toArray()
})


// GET call for loading note
app.get('/load', function(request,response) {
  response.writeHead( 200, "OK", { 'Content-Type': 'application/json'})
  loadNote(request,response, request.user.username)
})

// searches database for note
function loadNote(req, res, username){

  notes.findOne({username: username})
  .then(function(results){
    if(results !== null){
      const note = {
        noteTitle: results.title,
        noteBody: results.body
      }
      res.end(JSON.stringify(note))
    }
    else{
      res.end(JSON.stringify({message: "This account does not have a saved note!"}))
    }
  })
}

// GET call for getting all results
app.get(
  '/results',
  function( req, res){
    res.writeHead( 200, "OK", { 'Content-Type': 'application/json'})
    getResults(req, res)
    // res.end()
  }
)

// Retrieves all notes in db
function getResults(req, res){
  notes.find({}).toArray()
  .then(results => res.end(JSON.stringify(results)))
}

// GET call for notes.html
app.get('/notes', function(request, response) {
  // using cookie-parser to output current SID in console
  console.log("Cookies: ", request.cookies)
  response.sendFile(__dirname + '/notes.html');
});

// GET call for index.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/index.html');
});

// POST call for saving note
app.post( '/save', 
  function( request, response ) {
    response.writeHead( 200, "OK", { 'Content-Type': 'application/json'})
    saveNote(request.body, request.user.username)
    response.end()
})

// creates new note or modifies existing one
function saveNote(req, username){
  notes.findOne({username: username})
  .then(function(results){
    if(results !== null){
      notes.updateOne( {username: username}, {$set:{title: req.noteTitle, body: req.noteBody}})
    }
    else{
      notes.insertOne({username: username,title:req.noteTitle, body: req.noteBody})
    }
  })
}

// POST call for deleting a note
app.post( '/delete', 
  function( request, response ) {
    response.writeHead( 200, "OK", { 'Content-Type': 'application/json'})
    deleteNote(request.user.username)
    response.end()
})

// Deletes note if it exists
function deleteNote(username){
  notes.findOne({username: username})
  .then(function(results){
    if(results !== null){
      notes.deleteOne({username: username})
    }
  })
}

// local strategy for passport
const myLocalStrategy = function( username, password, done ) {
  // use db to find username 
  users.findOne({username:username})
  .then( function(results){ 
    let user = results
    if(user === null){
      console.log("User not found")
      return done( null, false, { message:'user not found' })
    }
    else if(user.password === password ){
      console.log("User was found")
      return done( null, { username, password })
    }
    else{
      console.log("Incorrect password")
      return done( null, false, { message: 'incorrect password' })
    }
  })
}

passport.use( new Local( myLocalStrategy ) )

// POST call for logging in
app.post( 
  '/login',
  passport.authenticate( 'local' ,
  {
    failureRedirect: '/' // redirect to same page if login fails
  }),
  function( req, res ) {
    res.redirect('/notes') // redirect to notes page if login succeeds
    
  }
)

// POST call for signing up
app.post( 
  '/newAcc',
  function( req, res ) {
    users.insertOne(req.body).then(result => res.json(result))
  }
)


passport.serializeUser( ( user, done ) => done( null, user.username ) )

// "name" below refers to whatever piece of info is serialized in seralizeUser,
// in this example we're using the username
passport.deserializeUser( ( username, done ) => {
  users.findOne({username:username})
  .then(function(results){
    const user = results
    if( user !== undefined ) {
      done( null, user )
    }else{
      done( null, false, { message:'user not found; session not restored' })
    }
  })
})

app.listen(process.env.PORT || 3000)
