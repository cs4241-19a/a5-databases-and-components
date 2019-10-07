// Random phrases to be shown in the units screen
const phrases = [
  "Praise is good! Praise that you deserve is even better! You deserve praise if you tried!",
  "Ignorance is bliss sometimes, sometimes it is better to do your own thing.",
  "Always be thankful!",
  "The main ingredient for a Cat...is happiness.",
  "Can you hear it? There is a Cat in everyone's hearts.",
  "It's okay to cry. It's okay to run away. You were not made that strong.",
  "Nyanko is Japanase for Cat. Everything is learning.",
  "Learning from comics is still learning.",
  "No more Battle Cats until you finish your homework!",
  "Come on, this has got to be worth a design point or two, yes?",
  "Every now and then, ping one of your competitor's websites using an IE6 VM. Keep them on their toes.",
  "If fighting is sure to result in victory, them you must fight! Sun Tzu said that.",
  "Sniper's a good job, m8.",
  "So long as you always maintain a sense of exploration, you will someday find the way out. This is my hope.",
  "Never Eat Sea Weed",
  "An A press is an A press. You can't say it's only a half!",
  "Save the frames, kill the animals.",
  "What is a man!? A dirty little pile of secrets!",
  "Common sense: The most uncommon of senses.",
  "Knack is back, baybeeeee!",
  "Remember to take care of yourself!",
  "Are you a real villain?",
  "o-|-<   Congratulations! You found the secret dude. You shall be lucky and fortunate for about an hour or so."
]

// check dependencies
var express = require('express');
var cookieParse = require('cookie-parser')
var bodyParser = require('body-parser')
var session = require('express-session')
var helmet = require('helmet');
var morgan = require('morgan');
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var mongodb = require('mongodb')

// Setup MondoDB
const uri = process.env.URI
const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collection = null

// Setup bcrypt
var bcrypt = require('bcrypt')
const saltRounds = 10;

var app = express();

// use middleware for all requests
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(helmet());
app.use(morgan('common'))
app.use( session({ secret:'Congratulations to the Battlecats!', resave:false, saveUninitialized:false }) )
app.use( passport.initialize() )
app.use( passport.session() )

/*
// Check for database connection
app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})
*/

// Passport initialization
const myLocalStrategy = function( username, password, done ) {
  let users
  
  // Check if user exists
  client.connect()
    // Get users collection
    .then( () => {
       return client.db( 'Nyankotrack' ).collection( 'Users' )
  })
    // Search for existing users with the same username
    .then( (_collection) => {
    users = _collection.find( {username: username, active: true} ).toArray()
    return users
  })
    // Check if a match was found
    .then( (users) => {
    if (users.length == 1) {
      // Check password
      if (bcrypt.compareSync(password, users[0].hash)) {
        // login was successful
        return done( null, { username, password })
      }
      else {
        // we found the user but the password didn't match...
        return done( null, false, { message: 'incorrect password' })
      }
    }
    else {
      // match wasn't found
      return done( null, false, { message: 'incorrect username' })
    }
  })
}
passport.use( new localStrategy( myLocalStrategy ) )

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

// "name" below refers to whatever piece of info is serialized in seralizeUser,
// in this example we're using the username
passport.deserializeUser( ( username, done ) => {
  let users
  
  // Check if user exists
  client.connect()
    // Get users collection
    .then( () => {
       return client.db( 'Nyankotrack' ).collection( 'Users' )
  })
    // Search for existing users with the same username
    .then( (_collection) => {
    users = _collection.find( {username: username, active: true} ).toArray()
    return users
  })
    // Check if a match was found
    .then( (users) => {
    if (users.length == 1) {
      let user = users[0].username
      if( user !== undefined ) {
        done( null, user)
      }
      else{
        done( null, false, { message:'user not found; session not restored' })
      }
    }
    else{
        done( null, false, { message:'user not found; session not restored' })
      }
  })
})

const getRandomText = function() {
  var phraseCount = phrases.length
  var i = Math.floor(Math.random() * phraseCount);
  return phrases[i]
}


// ============
// GET requests
// ============

// Handle GET requests
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
})

app.get('/accountCreation', function(request, response) {
  response.sendFile(__dirname + '/views/create.html');
})

app.get('/units', function(request, response) {
  if (request.user === undefined) {
    //User is not authenticated, get'em outta here!
    response.sendFile(__dirname + '/views/index.html');
  }
  else {
    response.sendFile(__dirname + '/views/units.html');
  }
})

// =============
// POST requests
// =============

app.post('/createAccount', function(request, response) {
  var newUser = request.body.username;
  var newPassword = request.body.password;
  let users;
  
  // Connect to database
  client.connect()
    // Get users collection
    .then( () => {
       return client.db( 'Nyankotrack' ).collection( 'Users' )
  })
    // Search for existing users with the same username
    .then( (_collection) => {
    users = _collection.find( {username: newUser, active: true} ).toArray()
    return users
  })
    // Check if user already exists
    .then( (users) => {
    if (users.length > 0) {
      // User already exists
      console.log("Username already exist");
      // Username already exists
      response.writeHead(403, "Forbidden", {'Content-Type': 'text/plain' })
      response.end("Username already exists");
    }
    // Else, start account creation
    else {
      // Create cats
      let cats = client.db('Nyankotrack').collection( 'Cats' )
      cats.insertOne({cat:1, wallcat:0, axecat:0, grosscat:0, cowcat:0, birdcat:0, fishcat:0, lizardcat:0, titancat:0}, function(err,docsInserted) {
        
        // Get id of created cats document
        let catsId = docsInserted.insertedId
        
        // Encrypt password
        bcrypt.genSalt(saltRounds, function(err, salt) {
          bcrypt.hash(request.body.password, salt, function(err, hash) {
            // Create user
            client.db( 'Nyankotrack' ).collection( 'Users' ).insertOne( {username:newUser, hash:hash, catsId:catsId, active:true} )
              .then(() => {
              // Send response
              response.redirect(303,'/');
            })
          });
        });
       })
    }
  })
});

app.post('/login',
  passport.authenticate( 'local'),
  function( req, res ) {
    console.log( 'user:', req.user );
    res.json({ status:true });
  }
)

app.post('/unitData', function(request, response) {
  if (request.user === undefined) {
    //User is not authenticated, get'em outta here!
    response.sendFile(__dirname + '/views/index.html');
  }
  else {
    // Get user's cats
    var username = request.user
    let users
  
    // Check if user exists
    client.connect()
      // Get users collection
      .then( () => {
         return client.db( 'Nyankotrack' ).collection( 'Users' )
    })
      // Search for existing users with the same username
      .then( (_collection) => {
      users = _collection.find( {username: username, active: true} ).toArray()
      return users
    })
      // Check if a match was found
      .then( (users) => {
      if (users.length == 1) {
        // retrieve cats data
        let catsId = users[0].catsId
        let cats = client.db( 'Nyankotrack' ).collection( 'Cats' ).find( { "_id" : catsId } ).toArray()
        return cats
      }
    })
      .then( (cats) => {
      // Check if result was found
      if (cats.length == 1) {
        // build form and send\
          var body = ({
          cat: cats[0].cat,
          wallcat: cats[0].wallcat,
          axecat: cats[0].axecat,
          grosscat: cats[0].grosscat,
          cowcat: cats[0].cowcat,
          birdcat: cats[0].birdcat,
          fishcat: cats[0].fishcat,
          lizardcat: cats[0].lizardcat,
          titancat: cats[0].titancat,
          splashtext: getRandomText()
        })
        //response.json(json)
        response.writeHead( 200, { 'Content-Type': 'application/json'})
        response.end(JSON.stringify(body))
      }
    })
    
  }
})

app.post('/updateUnits', function(request, response) {
  if (request.user === undefined) {
    //User is not authenticated, get'em outta here!
    response.sendFile(__dirname + '/views/index.html');
  }
  
  else {
    // Get user's cats
    let username = request.user
    let users
  
    // Check if user exists
    client.connect()
      // Get users collection
      .then( () => {
         return client.db( 'Nyankotrack' ).collection( 'Users' )
    })
      // Search for existing users with the same username
      .then( (_collection) => {
      users = _collection.find( {username: username, active: true} ).toArray()
      return users
    })
      // Check if a match was found
      .then( (users) => {
      if (users.length == 1) {
        // retrieve cats data
        let catsId = users[0].catsId
        let cats = client.db( 'Nyankotrack' ).collection( 'Cats' )
        cats.updateOne({_id:catsId},
                       {$set: { cat:       request.body.cat,
                                wallcat:   request.body.wallcat,
                                axecat:    request.body.axecat,
                                grosscat:  request.body.grosscat,
                                cowcat:    request.body.cowcat,
                                birdcat:   request.body.birdcat,
                                fishcat:   request.body.fishcat,
                                lizardcat: request.body.lizardcat,
                                titancat:  request.body.titancat}})
        response.writeHead(200)
        response.end()
      } 
    })
  }
})

app.post('/deleteAccount', function(request, response) {
  
    // Get user's cats
    let username = request.user
    let users
  
    // Check if user exists
    client.connect()
      // Get users collection
      .then( () => {
      return client.db( 'Nyankotrack' ).collection( 'Users' )
    })
      // Search for existing users with the same username
      .then( (_collection) => {
      users = _collection.find( {username: username} ).toArray()
      return users
    })
      // Check if a match was found
      .then( (users) => {
      if (users.length == 1) {
        client.db( 'Nyankotrack' ).collection( 'Users' ).updateOne({username:username}, {$set: { active:false } } )
        response.writeHead(200)
        response.end()
        return
      }
    })
}) 

// listen for requests
const listener = app.listen(process.env.PORT, function() {
  
})
