//express and middleware
const express = require("express"),
  app = express(),
  session = require("express-session"),
  passport = require("passport"),
  Local = require("passport-local").Strategy,
  bodyParser = require("body-parser"),
  cors = require("cors"),
  bcrypt = require("bcrypt");
const port = 3000;

//lowdb database
let low = require("lowdb"),
  FileSync = require("lowdb/adapters/FileSync"),
  adapter = new FileSync("db.json"),
  db = low(adapter);

//set database defaults when empty
db.defaults({ sites: [], users: [] }).write();

app.use(express.static("public/"));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

//cors
app.get("/cors-entry", function(req, res, next) {
  console.log("CORS Accessed");
  res.json({ msg: "CORS-enabled for all origins!" });
});

//current user when database restarts so that a name is always appearing
const currentuser = [{ username: "Login/Create", password: "default" }];

//passport identifying account
const myLocalStrategy = function(username, password, done) {
  const user = db
    .get("users")
    .find({ username: username })
    .value();

  if (user == undefined) {
    return done(null, false, { message: "incorrect password" });
  }
  try {
    if (bcrypt.compare(password, user.password)) {
      currentuser.splice(0, 1);
      currentuser.push({
        username: username,
        password: password
      });

      return done(null, { username, password });
    } else {
      done(null, false, { message: "incorrect password" });
    }
  } catch {
    return done(null, false, { message: "invalid compare" });
  }
};

passport.use(new Local(myLocalStrategy));

app.post("/login", passport.authenticate("local"), function(req, res) {
  res.json({ status: true });
});

passport.serializeUser((user, done) => done(null, user.username));

passport.deserializeUser((username, done) => {
  const user = db
    .get("users")
    .find({ username: username })
    .value();
  console.log("deserializing:", name);

  if (user !== undefined) {
    done(null, user);
  } else {
    done(null, false, { message: "user not found; session not restored" });
  }
});

app.use(
  session({ secret: "working", resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

//add location to database
app.post("/addLoc", function(req, res) {
  console.log("location added");
  let data = req.body;

  let change = 0;

  wat = db
    .get("sites")
    .filter({ city: data.city })
    .value();

  for (let i = 0; i < wat.length; i++) {
    if (wat[i].state_ === data.state_ && wat[i].user_ === data.user_) {
      change = 1;
    }
  }

  if (change === 0) {
    db.get("sites")
      .push(data)
      .write();
    res.json({ status: "success" });
    console.log("Succesfully Added");
  } else {
    console.log("Site Already Exists");
    response = JSON.stringify({ status: "failure" });
    res.end(response);
    //document.getElementById("submitted").innerHTML =
    //"*Site Already Submitted Reviewed by User";
  }
});

//add user
app.post("/add", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const data = { username: req.body.username, password: hashedPassword };
    db.get("users")
      .push(data)
      .write();
    res.json({ status: true });
  } catch {
    res.status(500).send();
  }
});

//remove location
app.post("/remLoc", function(req, res) {
  let data = req.body;

  db.get("sites")
    .remove({ uid: data.uid })
    .write();
});

//modify location
app.post("/modLoc", function(req, res) {
  let data = req.body;

  db.get("sites")
    .find({ uid: data.uid })
    .assign({ rating: data.rating })
    .write();

  db.get("sites")
    .find({ uid: data.uid })
    .assign({ desc: data.desc })
    .write();
});

//get and review databse sites
app.get("/view", function(req, res) {
  let respond = db.get("sites").value();
  let response = JSON.stringify(respond);
  res.end(response);
});

//change username appearing
app.get("/usernamechange", function(req, res) {
  let respond = currentuser[0].username;
  res.end(respond);
});

//retrieve username
app.get("/usernameget", function(req, res) {
  let respond = currentuser;
  let response = JSON.stringify(respond);
  res.end(response);
});

//cookie
app.post("/test", function(req, res) {
  //console.log("authenticate with cookie?", req.user);
  res.json({ status: "success" });
});

app.listen(process.env.PORT || port);
