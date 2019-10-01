// server.js
// where your node app starts

// init project

const express = require('express');
const Sequelize = require('sequelize');
const session = require('express-session');
const passport = require('passport');
const Local = require('passport-local').Strategy;
const bodyParser = require('body-parser');
const path  = require('path');
const favicon = require('serve-favicon');
const uncap = require('express-uncapitalize');
const slash   = require('express-slash');
const debug = require('express-debug');
const mongo = require('mongodb');


const app = express();

app.use(bodyParser.json());


const uri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+'/'+process.env.DB

const client = new mongo.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collectionUsers = null
let collectionItems = null

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'assignment5' ).createCollection( 'users' )
  })
  .then( __collection => {
    // store reference to collection
    collectionUsers = __collection
});

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'assignment5' ).createCollection( 'items' )
  })
  .then( __collection => {
    // store reference to collection
    collectionItems = __collection
});

app.use( (req,res,next) => {
  if( collectionUsers !== null && collectionItems !== null) {
    next()
  }else {
    res.status( 503 ).send()
  }
})


let User;
let Inventory;
let curUsername = "";
let curID = -1;



// http://expressjs.com/en/starter/static-files.html
app.use(express.static(__dirname + '/'));



// all authentication requests in passwords assume that your client
// is submitting a field named "username" and field named "password".
// these are both passed as arugments to the authentication strategy.
const myLocalStrategy = async function( username, password, done ) {
  // find the first item in our users array where the username
  // matches what was sent by the client. nicer to read/write than a for loop!
  let pass = "";
   const user = collectionUsers.findOne({ username: {$eq: username}})
   .then(user => {
      if(user !== null) {
          pass = user.password;
      } else {
          pass = "";
    }
    });
   await user;
    
  // if user is undefined, then there was no match for the submitted username
  if( user === undefined ) {
    /* arguments to done():
     - an error object (usually returned from database requests )
     - authentication status
     - a message / other data to send to client
    */
    
    return done( null, false, { message:'user not found' })
  }else if( pass === password ) {
    // we found the user and the password matches!
    // go ahead and send the userdata... this will appear as request.user
    // in all express middleware functions.
      
      curUsername = username;
    return done( null, { username, password })
  }else{
    // we found the user but the password didn't match...
      
    return done( null, false, { message: 'incorrect password' })
  }
};

passport.use( new Local( myLocalStrategy ) );
app.use( session({ secret:'cats cats cats', resave:false, saveUninitialized:false }) );
app.use(passport.initialize());
app.use( passport.session() );




passport.serializeUser( ( user, done ) => done( null, user.username ) );

// "name" below refers to whatever piece of info is serialized in seralizeUser,
// in this example we're using the username
passport.deserializeUser( ( username, done ) => {
    const user = collectionUsers.findOne({ username: {$eq: username}})
    
    
    console.log( 'deserializing:', username );

    if( user !== undefined ) {
        curUsername = username;
        done( null, user );
    }else{
        done( null, false, { message:'user not found; session not restored' });
    }
});

//app.use(favicon("https://cdn.glitch.com/1b6ba422-b77a-48e2-96fe-a31537973221%2Ffavicon.ico?v=1568611668241"));

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (request, response) {
  if(request.user){
    response.sendFile(__dirname + '/views/main.html');
  }else{
    response.sendFile(__dirname + '/views/index.html');
  }
});


app.post( 
  '/login',
  passport.authenticate( 'local', { successRedirect: '/main',
                                                    failureRedirect: '/fail',
                                                    failureFlash: false} ),
  
);

app.get('/fail', function(request, response){
   
   response.redirect('/');
});

app.get("/main", function (request, response){
    
    response.sendFile(path.join(__dirname+'/views/main.html'));

});

app.post("/createItem", function(request, response){
    
    collectionItems.insertOne( {
                        username: curUsername,
                        itemName: request.body.itemName,
                        itemQuantity: request.body.itemQuantity,
                        itemID: request.body.itemID,
                        itemDescription: request.body.itemDescription});
    response.sendStatus(200);
});

app.get("/getTable", function(request, response){
   let invItems = [];
  
  collectionItems.find({username: {$eq: curUsername}}).toArray()
   .then(function(items){
       items.forEach(function(item) {
           invItems.push([item.itemName, item.itemQuantity, item.itemID, item.itemDescription, item._id]);
       });
       response.json(invItems);
       
   })
});

app.post('/editSwitch', function(request, response){
  console.log(request.body.id)
    curID = request.body.id;
    response.sendFile(path.join(__dirname+'/views/editItem.html'));
});

app.post('/updateItem', function(request, response){
  console.log(curID);
  collectionItems.updateOne(
    {_id:mongo.ObjectID(curID)},
    {$set: {itemName: request.body.itemName,
           itemQuantity: request.body.itemQuantity,
           itemID: request.body.itemID,
           itemDescription: request.body.itemDescription}}
  )
   
  curID = -1;
  response.send(path.join(__dirname+'/views/main.html'));
});

app.post('/deleteItem', function(request, response){
  collectionItems.deleteOne({ _id:mongo.ObjectID(request.body.id)})
  .then(response.send({}));
});

app.post('/createAct', function(request, response) {
  collectionUsers.insertOne( {username: request.body.username, password: request.body.password});
    response.sendStatus(200);
});


app.use(uncap);
app.use(slash);
app.use(debug);

// listen for requests :)
let listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});