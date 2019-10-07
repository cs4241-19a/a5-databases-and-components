// server.js
// where your node app starts

// init project
const express = require("express"),
  app = express(),
  passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  low = require("lowdb"),
  FileSync = require("lowdb/adapters/FileSync"),
  userAdapter = new FileSync("./users.json"),
  dbAdapter = new FileSync("./db.json"),
  userdb = low(userAdapter),
  db = low(dbAdapter),
  bodyParser = require("body-parser"),
  moment = require("moment"),
  favicon = require("serve-favicon"),
  path = require("path"),
  helmet = require("helmet"),
  timeout = require("connect-timeout"),
  mongodb = require('mongodb');

app.use(express.static("./"));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(favicon(path.join(__dirname, "/public/favicon.ico")));
app.use(helmet());

const uri = 'mongodb+srv://tvpatterson:EtmRpEKXIy9jdMBY@cluster0-plcsw.mongodb.net/admin?retryWrites=true&w=majority'
const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let users = null
let posts = null

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'a3' ).createCollection( 'users' )
  })
  .then( __collection => {
    // store reference to collection
    users = __collection
    // blank query returns all documents
    return users.find({ }).toArray()
  })

client.connect()
  .then(() => {
  return client.db('a3').createCollection('posts')
})
.then(__collection => {
  posts = __collection
  return posts.find({}).toArray()
})

app.use( (req,res,next) => {
  if( users !== null && posts !== null) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

app.post("/save", timeout("5s"), bodyParser.json(), haltOnTimedout, function(
  req,
  res,
  next
) {
  savePost(req.body, function(err, id) {
    if (err) return next(err);
    if (req.timedout) return;
    res.send("saved as id " + id);
  });
});

function haltOnTimedout(req, res, next) {
  if (!req.timedout) next();
}

function savePost(post, cb) {
  setTimeout(function() {
    cb(null, (Math.random() * 40000) >>> 0);
  }, (Math.random() * 7000) >>> 0);
}

// let user = users.find({username:"admin"})
// console.log(user)

passport.use(
  new LocalStrategy(function(username, password, done) {
    users.findOne({username:username})
    .then(user => {
      if(!user) return done(null, false);
      if(user.password !== password) done(null, false);
      else return done(null, user);
    })
  })
);

passport.serializeUser(function(user, done) {
  done(null, user.username);
});

passport.deserializeUser(function(username, done) {
  users.findOne({username:username})
  .then(user => {
    if(user !== undefined) return done(null, user);
  })
});

let logged = {};
let i = 0;

app.post("/login", function(request, response, next) {
  passport.authenticate("local", function(err, user, info) {
    if (!user) {
      logged = {};
      return response.redirect("/login.html");
    }
    request.logIn(user, function(err) {
      logged = user;
      return response.redirect("/home.html");
    });
  })(request, response, next);
});

app.post("/register", function(request, response) {
  let regUsername = request.body.username
  let regPassword = request.body.password
  users.findOne({username:regUsername})
  .then(user => {
    if(!user) {
      users.insertOne({username:regUsername, password:regPassword})
      response.redirect("/login.html")
    } else {
      response.redirect("/register.html")
    }
  })
});

app.post("/submit", function(request, response) {
  let dte = moment().format("L");
  let tme = moment().format("LTS");
  posts.insertOne({username:logged.username, body:request.body.message, date:dte, time:tme})
  edit = false;
  response.redirect("/home.html");
});

app.post("/delete", function(request, response) {
  posts.deleteOne({_id:mongodb.ObjectID(request.body._id)})
  response.redirect("/home.html");
});

let edit = false;
let editID = "";
let editMessage = "";

app.post("/edit", function(request, response) {
  edit = true;
  editID = request.body._id;
  editMessage = request.body.message;

  response.redirect("/submit.html");
});

app.post("/isedit", function(request, response) {
  response.json({
    edit: edit,
    _id: editID,
    message: editMessage,
  });
});

app.post("/completeedit", function(request, response) {
  posts.updateOne({_id:mongodb.ObjectID(request.body._id)},
                 {$set:{body:request.body.message}});
  edit = false;
  response.redirect("/home.html");
});

app.post("/home", function(request, response) {
  console.log(logged)
  posts.find({username:logged.username}).toArray().then(result => response.json(result));
});

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  if (Object.entries(logged).length === 0 && logged.constructor === Object)
    response.redirect("/login.html");
  else response.sendFile(__dirname + "/views/login.html");
});

app.get("/logout.html", function(request, response) {
  logged = {}
  response.redirect("/login.html");
})

app.get("/login.html", function(request, response) {
  if (Object.entries(logged).length === 0 && logged.constructor === Object)
    response.sendFile(__dirname + "/views/login.html");
  else {
    response.redirect("/home.html");
  }
});

app.get("/home.html", function(request, response) {
  if (Object.entries(logged).length === 0 && logged.constructor === Object)
    response.redirect("/login.html");
  else response.sendFile(__dirname + "/views/home.html");
});

app.get("/submit.html", function(request, response) {
  if (Object.entries(logged).length === 0 && logged.constructor === Object)
    response.redirect("/login.html");
  else response.sendFile(__dirname + "/views/submit.html");
});

app.get("/register.html", function(request, response) {
  response.sendFile(__dirname + "/views/register.html");
})

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
