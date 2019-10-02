/*
 * Express Server Re-write 
 * James Plante
 */

// Constants and rates

const __path = "."

const costs = {
  cursors: 150,
  hobbyists: 1000,
  csMajors: 12000,
  softEngs: 150000,
  serverFarm: 500000,
  quantumComputers: 3000000
}

const express = require('express'),
  app = express(),
  session = require('express-session'),
  passport = require('passport'),
  bodyParser = require('body-parser'),
  pLocal = require('passport-local'),
  favicon = require('serve-favicon'),
  helmet = require('helmet'),
  mongodb = require('mongodb')

require('dotenv').config()


// Connect to MongoDB database
const uri = 'mongodb+srv://' + process.env.DB_USER + ':' + process.env.PASS + '@' + process.env.HOST + '/' + process.env.DB

const client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

let loginInfo = null
let userData = null

client.connect().then(function (err) {

  // Create userData and loginInfo collections if haven't already
  client.db('CSClicker').createCollection("userData").then(collection => {
    userData = collection
  })

  client.db('CSClicker').createCollection("loginInfo").then(collection => {
    loginInfo = collection
  })

  // Catch connection error if there is one
}).catch((err) => { console.log(err) })

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(express.static(__path));
app.use(bodyParser.json());
app.use(helmet());

/**
 * Authentication function adapted from Lecture 6 Notes.
 * (Thank you Prof. Roberts for the providing class notes. 
 * They really do help a lot!)
 * @param {*} username 
 * @param {*} password 
 * @param {*} done 
 */
const authenticateRequest = function (username, password, done) {
  console.log("User " + username + " requested")
  loginInfo.findOne({ userName: username })
    .then(user => {
      console.log("User " + JSON.stringify(user) + " found in database!")
      if (user.password == password) {
        done(null, { username, password })
      } else {
        done(null, false, { message: "User or password incorrect" });
      }
    })
    .catch(err => {
      done(null, false, { message: "User or password incorrect" });
    })
}

passport.serializeUser((user, done) => done(null, user.username))

// "name" below refers to whatever piece of info is serialized in seralizeUser,
// in this example we're using the username
passport.deserializeUser((username, done) => {
  loginInfo.findOne({ userName: username })
    .then(user => {
      console.log('deserializing:', user.userName)
      done(null, user.userName)
    })
    .catch(err => {
      console.log(err)
      done(null, false, { message: 'user not found; session not restored' })
    })

})

app.use(session({ secret: "supersecretpass", resave: false, saveUninitialized: false }));
passport.use(new pLocal(authenticateRequest));
app.use(passport.initialize());
app.use(passport.session());


// Default GET Request
app.get('/', function (request, response) {
  response.sendFile(__dirname + "/public/index.html");
});

app.get('/game.html', function (request, response) {
  response.sendFile(__dirname + "/public/game.html");
});

//
app.get('/login', function (request, response) {
  if (request.user !== undefined) {
    response.redirect("/public/game.html");
  } else {
    response.writeHead(404, { 'Content-Type': 'text/html' })
    response.end("Content not found!");
  }
});

// Get all data from all users and print it out.
app.get("/getAllData", function (request, response) {
  response.writeHead(200, { 'Content-Type': 'application/json' });

  userData.find({ }).toArray()
    .then(result => {
      response.end(JSON.stringify(result))
    })
    .catch(err => {
      console.log("Cannot find data!")
      response.end(JSON.stringify([]))
    })
});

// Get data from a specific username
app.get("/getData", function (request, response) {
  let uid = request.user;
  console.log("UID: " + uid);
  response.writeHeader(200, { 'Content-type': 'text/plain' })

  // Find the user, if found, then send back the result
  userData.findOne({ userName: uid })
    .then(result => {
      response.end(JSON.stringify(result))
    })
    // If user is not found
    .catch(err => {
      console.log("User not found!");
      response.end(JSON.stringify({}));
    })
});

/* POST Request to make a purchase and update data. */
app.post("/updateData", function (request, response) {
  response.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
  let body = request.body, userName = request.user;
  console.log("Updating data for user " + userName)
  console.log(JSON.stringify(body))
  // Action: getData = get the data from the server given UID and send it back to client
  switch (body.action) {
    // Get a unique UID and send it back.
    case "modifyData":
      console.log(body)
      addDeltaToAppData(userName, body)
        .then(retVal => {
          if (retVal) {
            response.end("Transaction Completed")
          } else {
            response.end("Not enough money")
          }
        });
  }
});

/* POST Request to handle deleting data */
app.post("/deleteUserData", function (request, response) {
  response.writeHead(200, "OK", { "Content-type": 'text-plain' })
  let verification = request.body, userName = request.user;
  console.log("Delete data: " + verification.consent)
  if (verification.consent = "yes") {
    createNewUserData(userName);
  }
  response.end()
});

/* POST Request to handle logins */
app.post("/login", passport.authenticate('local'),
  function (req, res) {
    if (req.user === undefined) {
      console.log("Cannot find login!");
      res.json({ message: "User not found!" });
    } else {
      res.json({ message: "Logged In!" });
    }
    console.log("Logged in! " + req.user);
  });

// Handles creating new user accounts
app.post("/signUp", function (request, response) {
  let credentials = request.body;
  // Find the user
  loginInfo.findOne({userName : credentials.username})
  .then((user)=> {
    // If unsuccessful, then add to database. Else, return a 404.
    if (user != null) {
      console.log("User already exists!")
      response.writeHead(404, "File not found");
      response.end()
    } else {
      createNewUser(credentials.username, credentials.password)
      createNewUserData(credentials.username)
      response.redirect(200, "/game.html")
    }
  })
  .catch(err => {
    console.log(err)
  })
});


/* Helper functions */

/**
 * Creates a new user based on their username and password
 * @param {*} username 
 * @param {*} password 
 * @return Promise to handle the insertion into the database
 */
const createNewUser = function (username, password) {
  console.log("New username : " + username + "New Password: " + password)

  return loginInfo.insertOne({ userName: username, password: password })
}

/**
 * Create a new user in the database with the given username. If the user
 * already exists clear the existing data.
 * @param {String} username 
 */
const createNewUserData = function (username) {
  // Get the existing user (if it exists)
  let newDocument = {
    userName: username,
    loc: 0,
    cursors: 0,
    hobbyists: 0,
    csMajors: 0,
    softEngs: 0,
    server: 0,
    quantumComputers: 0,
    totalLoc: 0
  }

  userData.findOne({ userName: username }, newDocument).then(data => {
    if (data === null) {
      userData.insert(newDocument)
      .then(data => {
        console.log("New data entry for " + username + " has been created.")
      })
    } else {
      userData.findOneAndReplace({userName: username}, newDocument)
      .then((data) => {
        console.log("User " + username + "'s memory has been wiped.")
      })
    }
  }).catch((err) => {
  })
}

/***
 * Calculates the cost of a given purchase given a delta object
 * @param deltaObject
 */
const calculateCost = function (delta) {
  return (costs.cursors * delta.cursors)
    + (costs.hobbyists * delta.hobbyists) +
    (costs.csMajors * delta.csMajors) +
    (costs.softEngs * delta.softEng) +
    (costs.serverFarm * delta.server) +
    (costs.quantumComputers * delta.quantum);
};

/**
 * Given a delta object, either add the necessary purchased elements
 * to the cached object and return true, or if the user does not
 * have enough loc, then return false
 */
const addDeltaToAppData = function (userName, delta) {
  return new Promise( (resolve, reject) => {

  console.log("Deltauser = " + userName)
  userData.findOne({ userName: userName })
    .then(appdata => {
      // If user is found then do these operations
      console.log("NEW DELTA: " + JSON.stringify(delta))
      let totalCost = calculateCost(delta);
      if ((delta.currentLOC - totalCost) < 0) {
        // Update the response anyway
        appdata.totalLoc += (delta.currentLOC - appdata.loc)
        appdata.loc = delta.currentLOC;
        // Update database
        userData.findOneAndReplace({ userName: userName }, appdata)
        .then(() => {
          console.log("Save file updated!")
          resolve(false)
        })
        .catch((err)=>{
          console.log(err)
        })
        // Else, store all of the delta values in the existing database
      } else {
        appdata.totalLoc += (delta.currentLOC - appdata.loc)
        appdata.loc = delta.currentLOC - totalCost;
        appdata.cursors += delta.cursors;
        appdata.hobbyists += delta.hobbyists;
        appdata.csMajors += delta.csMajors;
        appdata.softEngs += delta.softEng;
        appdata.server += delta.server;
        appdata.quantumComputers += delta.quantum;

        userData.findOneAndReplace({ userName: userName }, appdata)
        .then(() => {
          console.log("Save file updated!")
          resolve(true)
        })
        .catch((err)=>{
          console.log(err)
        })
      }
    })
    .catch(err => {
      console.log("User not found!");
      resolve(false)
    })
  })
};

app.listen(process.env.PORT || 3000)
