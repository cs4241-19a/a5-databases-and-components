const express = require("express");
const mongodb = require( 'mongodb' );
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var low = require('lowdb');
const bodyParser = require("body-parser");
var FileSync = require('lowdb/adapters/FileSync');
var adapter = new FileSync('db.json');
//const axios = require('axios');
const bcrypt = require('bcrypt');
var db = low(adapter);
const app = express();
db.defaults({ tickets: [], users: {}, count: 0 }).write()
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
  .then( console.log(collection) )

app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})
// we've started you off with Express, 
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html




const uuid = require('uuid/v4');
//app.use(require('morgan')('combined'));

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const session = require('express-session')
const FileStore = require('session-file-store')(session);
app.use(session({
  genid: function(request){
    return uuid();
  },
  store: new FileStore(),
    secret: 'derps',
    resave: false,
    saveUninitialized: false
}));

passport.use(new LocalStrategy(
  function(username, password, done) {
    var user = db.get('users').find({username: username}).value();

      if (!user) {console.log("Big ooppps"); return done(null, false, {message: "Invalid username or password"});}
    bcrypt.compare(user.password, password, function(err, res) {
    return done(null, user);
});
      //if (password != user.password) {console.log("Big oops"); return done(null, false, {message: "Invalid username or password"}); }
      
    })
  
);

passport.serializeUser((user, done) => {
  console.log(user);
  done(null, user.username);
});

passport.deserializeUser(function(username, cb) {

  
  var user = db.get('users').find({username: username}).value();
      if(!user) {
      cb({ message: 'Invalid credentials.' }, null);
    } else {
      cb(null, {username: user.username})
    }
    
});

app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));


  


// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.render("index.html");

});

app.get('/index', function(request, response) {
//response.sendFile(__dirname + "/views/tickets.html");
  response.render("index.html");

  
});
app.get('/viewOrders',function(request,response){
  
response.render("tickets.html")

  //response.sendFile(__dirname + "/views/tickets.html");
});

app.get('/login',function(request,response){
  //response.render("login.html");
  response.sendFile(__dirname + "/views/login.html");
});

app.post('/login', 
    (req, res, next) => {
  console.log('Inside POST /login callback')
  
  passport.authenticate('local', (err, user, info) => {   
    req.login(user, (err) => {
      return res.redirect('/');
    })
  })(req, res, next);
  
  });

app.get('/logout', function (req, res){
  req.session.destroy(function (err) {
    res.redirect('/'); 
  });
});

app.post('/register',function(request,response){
  const acc=request.body;
  var usernames = db.get('users').map('username').value();

  var isUserNameTaken = usernames.includes(acc.username);
  console.log(isUserNameTaken);
  
  if(isUserNameTaken){
    response.render("badlogin.html", {error: "Username already taken"});
  } else {
    console.log("Yay!!");
    bcrypt.genSalt(10,function(err, salt){
      bcrypt.hash(acc.password, salt, function(err, hash){
        console.log(hash);
        console.log(acc.username);
            db.get('users').push({username: acc.username, password: hash}).write();
    })
    
    

    response.redirect("index");
  })
  
}});

app.get('/tickets', async function(request, response) {

  if( collection !== null ) {
    // get array and pass to res.json
    await collection.find({ }).toArray().then( result => response.json( result ) )
  }
  //response.send({tickets: db.get("tickets").value()});
});

app.post('/modify', function(request, response){
  const order = request.body
  console.log(request.body.orderID);
  
/*  
              db.get("tickets")
              .find({orderID : parseInt(order.orderID)})
              .assign({ 
          username: request.session.passport.user,
          name: order.name,           
          phone: parseInt(order.phone),
          fish: order.fish,
          style: order.style,
          amount: parseInt(order.amount),
          price: calcPrice(order.fish, parseInt(order.amount)),
          orderID: parseInt(order.orderID)})
        .value();

*/
    collection
    .updateOne(
      { _id:mongodb.ObjectID( request.body.orderID ) },
      { $set:{ name:order.name, phone: parseInt(order.phone),
          fish: order.fish,
          style: order.style,
          amount: parseInt(order.amount),
          price: calcPrice(order.fish, parseInt(order.amount))  } }
    )
  
  response.render("tickets.html");
});

app.get('/modify'), function(request, response){

  //response.render("modify.html");
}
app.post('/submit', async function(request, response) {
        const order = request.body;
        let current;
        if( collection !== null ) {
    // get array and pass to res.json
        current = await collection.find({ }).toArray()
        }

        order.price = calcPrice(order.fish, parseInt(order.amount));
        const id = parseInt(current[current.length-1].orderID) + 1;
        
/*        
        db.get("tickets")
        .push({ 
          username: request.session.passport.user,
          name: order.name,           
          phone: parseInt(order.phone),
          fish: order.fish,
          style: order.style,
          amount: parseInt(order.amount),
          price: price,
          orderID: parseInt((db.get("count")+1))})
        .write();
        
        db.update('count', n => n + 1)
  .write();
*/
  collection.insertOne( request.body ).then( result => response.json( result ) )
  response.redirect("index");
});

app.post('/delete', function(request, response){
  const order = request.body;
  //db.get('tickets')
  //.remove(order)
  //.write();
  collection
    .deleteOne({ _id:mongodb.ObjectID( request.body._id ) })
    .then( result => response.json( result ) )
})

app.get('/user', function(request, response){
  //console.log(request.session.passport.user);
  response.send({user: request.session.passport.user})
})

const calcPrice = function(fishType, amtFish){
  var price = 0;
  
  switch(fishType){
    case "salmon":
      price += (3*amtFish);
      break;
    case "tuna":
      price += (5*amtFish);
      break;
  }
  
  return price;
}


// listen for requests :)

const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
