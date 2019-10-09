// server.js
// where your node app starts

// init project
var express = require('express');
var mongodb = require('mongodb');
var bodyParser = require('body-parser');
var passport = require('passport');
var path = require('path');
var cors = require('cors');
var favicon = require('serve-favicon');
var session = require('express-session');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var clientID = "975767094128-4gqj31rg05klp504jm9aoqh1i75fp73d.apps.googleusercontent.com";
var clientSecret = "Qxq8oeLFhlvCysxAWeSJafJI";
var clientInfo = {id: -1, name: "0", image: ""};
var app = express();
//app.use(favicon('831da1ea-1e50-4148-9a1d-b5e53a712f89%2Ffavicon.ico?v=1568599722423.1'));
//app.use(favicon(__dirname + '831da1ea-1e50-4148-9a1d-b5e53a712f89%2Ffavicon.ico?v=1568599722423.1'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({ secret:'google secret', resave:false, saveUninitialized:true}));
app.use(passport.initialize());
app.use(express.static('public'));
app.use(passport.session());
app.use(cors());

app.get('/cors-entry', function (req, res, next) {
  console.log('CORS Accessed');
  res.json({msg: 'Odd Blog is CORS-enabled for all origins!'})
})

app.get('/auth/google',
  passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });


passport.use(new GoogleStrategy({
    clientID: clientID,
    clientSecret: clientSecret,
    callbackURL: "https://a5-dandaman2.glitch.me/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
       // User.findOrCreate({ googleId: profile.id }, function (err, user) {
         // return done(err, user);
       // });
    console.log('user coming in...');
    return done(null, profile);
  }
));

passport.serializeUser(function(user, done) {
  console.log('serialize\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\', user);
  clientInfo = extractProfile(user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log('deserialize////////////////////////////', user);
  clientInfo = extractProfile(user);
  done(null, user);
});


//Database Setup
const MongoClient = mongodb.MongoClient;

let collection = null;
const uri = "mongodb+srv://"+process.env.USER+":"+process.env.PASS+"@cluster0-m7osd.gcp.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true});
client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'test' ).createCollection( 'blogposts' );
  })
  .then( __collection => {
    // store reference to collection
    collection = __collection
    //initial collection
    //collection.insertOne({title: "First MongoDB Post!", date: "Before Time Started", body: "This is a sample body!", user: "Daniel the Duffster", id: "_5", userID: "1"} );
    //collection.remove({});  
  // blank query returns all documents
    return collection.find({ }).toArray();
  })
  .then( console.log );

//get html asset
app.get('/', function(request, response) {
  //console.log(clientInfo, 'request', request.user);
  response.sendFile(__dirname + '/views/index.html');
});

//returns all post data 
app.get('/getPosts', function(request, response) {
  clientInfo = extractProfile(request.user);
  collection.find({ }).toArray()
    .then(result => response.send(JSON.stringify({"rows": result, "userData": clientInfo})));
});


//Add post to the database (title, date, body, user, id, userID)
app.post('/addToDb', function (req, res) {
  let entry = req.body;
  collection.insertOne({title: entry.title, date: entry.date, body: entry.body, user: entry.user, id: entry.id, userID: entry.userId});
});

//Removes the post from the database based on ID
app.post('/removeFromDb', function (req, res) {
  let id = req.body.id;
  collection.deleteOne({id:id}).then(result => res.json(result));
});

//Logs the user out of google
app.post('/logout', function(req, res){
  req.session.destroy();
  res.json({respVal: "logged out " + req.user.id});
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

function extractProfile(profile) {
  if(!profile){
    return {
      id: -1,
      name: "0",
      image: ""
    }
  }
  
  let imageUrl = '';
  if (profile.photos && profile.photos.length) {
    imageUrl = profile.photos[0].value;
  }
  return {
    id: profile.id,
    name: profile.displayName,
    image: imageUrl,
  };
}
