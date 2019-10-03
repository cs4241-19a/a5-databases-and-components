// init express
const express = require("express");
const mongodb = require("mongodb");
const port = 3000;
const app = express();
require('dotenv').config();

const uri = 'mongodb+srv://' + process.env.USER + ':' + process.env.PASSWORD + '@' + process.env.HOST + '/' + process.env.DB

//middleware
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const Local = require("passport-local").Strategy;
var responseTime = require("response-time");

// MongoDB connection
const client = new mongodb.MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
let userData = null
let itemData = null

client.connect()
  .then(() => {
    // will only create collection if it doesn't exist
    return client.db('Shopr').createCollection('users')
  })
  .then(__collection => {
    // store reference to collection
    userData = __collection
    // blank query returns all documents
    return userData.find({}).toArray()
  })

client.connect()
  .then(() => {
    // will only create collection if it doesn't exist
    return client.db('Shopr').createCollection('items')
  })
  .then(__collection => {
    // store reference to collection
    itemData = __collection
    // blank query returns all documents
    return itemData.find({}).toArray()
  })

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(
  session({
    secret: "shopr",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(responseTime());

// all authentication requests in passwords assume that your client
// is submitting a field named "username" and field named "password".
// these are both passed as arugments to the authentication strategy.
const myLocalStrategy = function (username, password, done) {
  // find the first item in our users array where the username
  // matches what was sent by the client. nicer to read/write than a for loop!
  userData.findOne({
    username: username
  }).then(user => {
    // if user is undefined, then there was no match for the submitted username
    if (user === null) {
      /* arguments to done():
       - an error object (usually returned from database requests )
       - authentication status
       - a message / other data to send to client
      */
      return done(null, false, {
        message: "user not found"
      });
    } else if (user.password === password) {
      // we found the user and the password matches!
      // go ahead and send the userdata... this will appear as request.user
      // in all express middleware functions.
      return done(null, {
        username,
        password
      });
    } else {
      // we found the user but the password didn't match...
      return done(null, false, {
        message: "incorrect password"
      });
    }
  })
};

const mySignupStrategy = function (username, password, done) {
  userData.findOne({
    username: username
  }).then(result => {
    if (result === null) {
      userData.insertOne({
        username: username,
        password: password
      })
      console.log("new user added to db!");

      return done(null, {
        username,
        password
      })
    } else {
      return done(null, false, {
        message: "username already exists"
      })
    }
  })
};

passport.use("local", new Local(myLocalStrategy));
passport.use("local-signup", new Local(mySignupStrategy));

passport.serializeUser((user, done) => done(null, user.username));

passport.deserializeUser((username, done) => {
  userData.findOne({
    username: username
  }).then(user => {
    if (user !== undefined) {
      done(null, user);
    } else {
      done(null, false, {
        message: "user not found; session not restored"
      });
    }
  })
});

function calcEuroPrice(usd) {
  return (usd * 0.91).toFixed(2);
}

// ROUTING
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/login.html");
});

app.get("/items", function (req, res) {
  console.log(req.user);
  if (req.user == undefined) {
    res.writeHead(404, {
      "Content-Type": "text/html"
    });
    res.end();
  } else {
    itemData.find({
      user: req.user.username
    }).toArray().then(items => {
      if (items === undefined) {
        console.log("no data for this user");
        res.end();
      } else {
        console.log("sending data to client");
        res.json(items);
      }
    })
  }
});

app.get("/index", function (req, res) {
  console.log(req.user);
  if (req.user == undefined) {
    console.log("undefined user");
    res.writeHead(404, {
      "Content-Type": "text/html"
    });
    res.end();
  } else {
    res.sendFile(__dirname + "/views/index.html");
  }
});

//adds a new item
app.post("/items", function (req, res) {
  let data = req.body;
  let user = req.user ? req.user.username : "no user";

  const newItemObj = {
    user: user,
    name: data.name,
    category: data.category,
    rating: parseInt(data.rating),
    usd: parseFloat(data.usd),
    eur: calcEuroPrice(parseFloat(data.usd)),
    link: data.link
  };

  itemData.insertOne(newItemObj).then(result => res.json(result))

  res.writeHead(200, "OK", {
    "Content-Type": "text/plain"
  });
  res.send();
});

app.post("/login", passport.authenticate("local"), function (req, res) {
  res.json({
    username: req.user.username
  });
});

app.post("/register", passport.authenticate("local-signup"), function (
  req,
  res
) {
  res.json({
    username: req.user.username
  });
});

//updates an existing item
app.put("/items", function (req, res) {
  itemData.updateOne({
    _id: mongodb.ObjectID(req.body.id)
  }, {
    $set: {
      name: req.body.name,
      category: req.body.category,
      rating: parseInt(req.body.rating),
      usd: parseFloat(req.body.usd),
      eur: calcEuroPrice(parseFloat(req.body.usd)),
      link: req.body.link
    }
  }).then(result => console.log(result))

  res.writeHead(200, "OK", {
    'Content-Type': 'text/plain'
  });
  res.end();
});

// deletes an existing item
app.delete("/items", function (req, res) {
  console.log("BODY: " + JSON.stringify(req.body))
  itemData.deleteOne({
    _id: mongodb.ObjectID(req.body.id)
  }).then(result => res.json(result))
});

// listen for requests 
const listener = app.listen(port, function () {
  console.log("Your app is listening on port " + listener.address().port);
});