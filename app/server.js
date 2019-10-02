var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local').Strategy;
var dbMe = require('./dbMe');
var fs = require('fs')
var mime = require('mime')

var morgan = require('morgan')
var cookieParser = require('cookie-parser')
var featurePolicy = require('feature-policy')
var referrerPolicy = require('referrer-policy')


var mongodb = require( 'mongodb' )
  
const uri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+'/'+process.env.DB

const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collection = null

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'test' ).createCollection( 'todos' )
  })
  .then( __collection => {
    // store reference to collection
    collection = __collection
    // blank query returns all documents
    return collection.find({ }).toArray()
  })
  .then( console.log )


// Configure the local strategy for use by Passport.
passport.use(new Strategy(
  function(username, password, cb) {
    dbMe.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false); }
      if (user.password != password) { return cb(null, false); }
      return cb(null, user);
    });
  }));


// Configure Passport authenticated session persistence.
passport.serializeUser(function(user, cb) {
  //console.log("serialize user")
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  //console.log("deserialize user")
  dbMe.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    cb(null, user);
  });
});


// Create a new Express application.
var app = express();
app.use(express.static(__dirname + '/public'));

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/public/views');
app.set('view engine', 'ejs')

app.use(cookieParser())

app.use(featurePolicy({
  features: {
    fullscreen: ["'self'"],
    syncXhr: ["'none'"]
  }
}))
app.use(referrerPolicy({ policy: 'same-origin' }))

app.use(morgan('combined'))
app.use(require('body-parser').json())

app.use(require('body-parser').urlencoded({ extended: true }));

app.use(require('express-session')({ secret: 'keyboard cat', resave: false, saveUninitialized: false }));

// Initialize Passport and restore authentication state, if any, from the
// session.
app.use(passport.initialize());
app.use(passport.session());


app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})


// Define routes.

// for '/' return index.ejs with the current user from the req.user
app.get('/',
  function(req, res) {
    if(req.user){
      res.render('user', { user: req.user });
    }
    else{
      res.render('login', {});    
    }
  });

// if request to login page, return the login page
app.get('/login',
  function(req, res){
    res.render('login');
  });

// if a post to login is received
app.post('/login_a_user', 
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    //console.log( 'user:', req.user )
    res.end(JSON.stringify({ status:true }))
  });

app.get('/logout',
  function(req, res){
    req.logout();
    res.redirect('/');
  });


app.get('/getDatabase', 
  function(req, res){  
    let query = {"_id" : mongodb.ObjectId("5d94d3e4b0b4b21996d455be") }
    collection.find(query).toArray().
    then(function(result){
      res.writeHeader( 200, { 'Content-Type': 'application/json' });
      res.end(setDerivedField(result[0]['all_data']));
    })
});

app.get('/download', function(req, res){
  const file = "database.json";
  res.download(file); // Set disposition and send it.
});

app.post('/updateUser',
  passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    var json_data = JSON.stringify(req.body.data)
    
    setDerivedField(json_data);
    console.log(json_data);
       
    let query = {"_id" : mongodb.ObjectId("5d94d3e4b0b4b21996d455be") }
    let replacement_data = {"all_data": json_data}
    collection.replaceOne( query, replacement_data )
  
    fs.writeFile("./database.json", json_data, (err) => {if (err) throw err;});
    res.writeHeader( 200, { 'Content-Type': 'application/json' });
    res.end("Successfully Updated Database");
});

// tell server to listen
app.listen( process.env.PORT || 3000 );


const setDerivedField = function(content){
  let json_data = JSON.parse(content);
  for (var c in json_data){
    for(var user in json_data[c]) {
      for(var field in json_data[c][user]){
        if(field === "data"){
          for (var date in json_data[c][user][field]){
            let total_sum = 0;
            for (var user_info_field in json_data[c][user][field][date]){
              if (user_info_field !== "score"){
                if (json_data[c][user][field][date][user_info_field] === "true" ){
                  total_sum += 1;
                }
              }
            }
            json_data[c][user][field][date]["score"] = total_sum;
          }
        }
      }
    }
  }  
  return JSON.stringify(json_data)
}