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
  low = require('lowdb'),
  FileSync = require('lowdb/adapters/FileSync'),
  favicon = require('serve-favicon'),
  helmet = require('helmet'),
  adapter = new FileSync(__path + '/.private/db.json'),
  db = low(adapter);

// Initialize database
db.defaults({
  users: [{ userName: "", password: "" }],
  appdata: [{
    userName: "",
    loc: 0,
    cursors: 0,
    hobbyists: 0,
    csMajors: 0,
    softEngs: 0,
    server: 0,
    quantumComputers: 0,
    totalLoc: 0
  }],
  secret: "Foo"
}).write();

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
  const user = db.get("users").find(__user => __user.userName === username).value();

  console.log("User " + user.userName + " requested")
  /* Check if username is empty as well as undefined */
  if (user === undefined) {
    return done(null, false, { message: "User or password incorrect" });
    /* If password is correct */
  } else if (user.password === password) {
    return done(null, { username, password });
    /* Password is incorrect */
  } else {
    return done(null, false, { message: "User or password incorrect" });
  }
}

passport.serializeUser((user, done) => done(null, user.username))

// "name" below refers to whatever piece of info is serialized in seralizeUser,
// in this example we're using the username
passport.deserializeUser((username, done) => {
  // Get the user
  const userName = db.get("users").find(__user => __user.userName === username).value();
  console.log('deserializing:', userName.userName)

  if (userName !== undefined) {
    done(null, username)
  } else {
    done(null, false, { message: 'user not found; session not restored' })
  }
})

app.use(session({ secret: db.get("secret").value(), resave: false, saveUninitialized: false }));
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
app.get('/login', function(request, response) {
  if(request.user !== undefined){
    response.redirect("/public/game.html");
  } else {
    response.writeHead(404, { 'Content-Type': 'text/html'})
    response.end("Content not found!");
  }
});

// Get all data from all users and print it out.
app.get("/getAllData", function (request, response) {
  response.writeHead(200, { 'Content-Type': 'application/json' });
  let appdata = db.get("appdata").value()
  response.end(JSON.stringify(appdata));
});

// Get data from a specific username
app.get("/getData", function (request, response) {
  let uid = request.user;
  console.log("UID: " + uid);
  response.writeHeader(200, { 'Content-type': 'text/plain' })
  let appdata = db.get("appdata").find(__user => __user.userName === uid).value();
  // Look through the given data for a UID and send the JSON as a response
  if (appdata === undefined) {
    console.log("User not found!");
    response.end(JSON.stringify({}));
  } else {
    response.end(JSON.stringify(appdata))
  }
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
      if (addDeltaToAppData(userName, body)) {
        response.end("Transaction Completed")
      } else {
        response.end("Not enough money")
      }
  }
});

/* POST Request to handle deleting data */
app.post("/deleteUserData", function(request, response) {
  response.writeHead(200, "OK", {"Content-type" : 'text-plain'})
  let verification = request.body, userName = request.user;
  console.log("Delete data: " + verification.consent)
  if (verification.consent = "yes") {
    createNewUserData(userName);
  }
  response.end()
});

/* POST Request to handle logins */
app.post("/login",  passport.authenticate('local'),
  function (req, res) {
    if (req.user === undefined) {
      console.log("Cannot find login!");
      res.json({message:"User not found!"});
    } else {
      res.json({message:"Logged In!"});
    }
    console.log("Logged in! " + req.user);
});

app.post("/signUp", function(request, response){
  let credentials = request.body;
  if(createNewUser(credentials.username, credentials.password)){
    response.redirect(200, "/game.html")
  } else {
    response.writeHead(404, "File not found");
    response.end("User already exists");
  }
})


/* Helper functions */

/**
 * Creates a new user based on their username and password
 * @param {*} username 
 * @param {*} password 
 * @return true if new user is created, false if not.
 */
const createNewUser = function(username, password) {
  console.log("New username : " + username + "New Passowrd: " + password )
  let searchUser = db.get("users").find(__user => __user.userName === username);

  if (searchUser.value() === undefined) {
    // Create a new user!
    console.log("Creating new user!");
    db.get("users").push({
      userName: username,
      password: password
    }).write();
    // Create app data for the user.
    createNewUserData(username);
    return true;
  } else {
    console.log("User already created!");
    return false;
  }
}

/**
 * Create a new user in the database with the given username. If the user
 * already exists clear the existing data.
 * @param {String} username 
 */
const createNewUserData = function (username){
  console.log("createNewUserData " + username)
  let appdataEntry = db.get("appdata").find(__user => __user.userName === username);
  let appdata = appdataEntry.value();
  let newObject = {userName: username,
    loc: 0,
    cursors: 0,
    hobbyists: 0,
    csMajors: 0,
    softEngs: 0,
    server: 0,
    quantumComputers: 0,
    totalLoc: 0
  };

  if (appdata === undefined) {
    db.get("appdata").push(newObject).write();
  } else {
    appdataEntry.assign(newObject).write();
  }
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
  console.log("Deltauser = " + userName)
  let appdataEntry = db.get("appdata").find(__user => __user.userName === userName);
  let appdata = appdataEntry.value();
  console.log("Current app Data= " + appdata)
  // Look through the given data for a UID and send the JSON as a response
  if (appdata === undefined) {
    console.log("User not found!");
    return false;
  } else {
    console.log("NEW DELTA: " + JSON.stringify(delta))
    let totalCost = calculateCost(delta);
    console.log("Purchase UID: " + delta.uid);
    // If the cost is too great, return false
    if ((delta.currentLOC - totalCost) < 0) {
      appdata.totalLoc += (delta.currentLOC - appdata.loc)
      appdata.loc = delta.currentLOC;
      // Update database
      appdataEntry.assign(appdata).write();
      return false;
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
    
      appdataEntry.assign(appdata).write();
      return true;
    }
  }
};

app.listen(process.env.PORT || 3000);