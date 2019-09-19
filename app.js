const express = require("express"),
  app = express(),
  session = require("express-session"),
  passport = require("passport"),
  Local = require("passport-local").Strategy,
  bodyParser = require("body-parser"),
  cors = require("cors"),
  bcrypt = require("bcrypt");
const port = 3000;

let low = require("lowdb"),
  FileSync = require("lowdb/adapters/FileSync"),
  adapter = new FileSync("db.json"),
  db = low(adapter);

db.defaults({ sites: [], users: [] }).write();

//test post for a destination
let addSite = {
  city: "Meredith",
  state: "NH",
  description:
    "Stayed in wonderful lakehouse property along Lake Winnipesaukee. Lots to do and the weather was amazing. Looking to buy a house here now!",
  rating: 5,
  user_: 0
};

app.use(express.static("public/"));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());

app.get("/cors-entry", function(req, res, next) {
  console.log("CORS Accessed");
  res.json({ msg: "CORS-enabled for all origins!" });
});

const currentuser = [{ username: "Login", password: "default" }];

const myLocalStrategy = function(username, password, done) {
  const user = db
    .get("users")
    .find({ username: username })
    .value();
  let unotFound = { message: "user not found" };
  let notFound = JSON.stringify(unotFound);

  if (user === undefined) {
    return done(null, false, notFound);
  } else if (user.password === password) {
    currentuser.splice(0, 1);
    currentuser.push({
      username: username,
      password: password
    });

    return done(null, { username, password });
  } else {
    return done(null, false, { message: "incorrect password" });
  }
};

passport.use(new Local(myLocalStrategy));

app.post("/login", passport.authenticate("local"), function(req, res) {
  console.log(currentuser);
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

app.post("/addLoc", function(req, res) {
  console.log("location added");
  let data = req.body;

  let change = 0;

  wat = db
    .get("sites")
    .filter({ city: data.city })
    .value();

  for (let i = 0; i < wat.length; i++) {
    if (wat[i].state_ === data.state_) {
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
    //document.getElementById("submitted").innerHTML =
    //"*Site Already Submitted Reviewed by User";
  }
});

app.post("/add", function(req, res) {
  let data = req.body;
  db.get("users")
    .push(data)
    .write();
  res.json({ status: true });
});

app.post("/remLoc", function(req, res) {
  let data = req.body;
  console.log(data);

  db.get("sites")
    .remove({ uid: data.uid })
    .write();
});

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

app.get("/view", function(req, res) {
  let respond = db.get("sites").value();
  let response = JSON.stringify(respond);
  res.end(response);
});

app.get("/usernamechange", function(req, res) {
  let respond = currentuser[0].username;
  res.end(respond);
});

app.get("/usernameget", function(req, res) {
  console.log(currentuser);
  let respond = currentuser;
  let response = JSON.stringify(respond);
  res.end(response);
});

app.post("/test", function(req, res) {
  console.log("authenticate with cookie?", req.user);
  res.json({ status: "success" });
});

app.listen(process.env.PORT || port);
