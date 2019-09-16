const express = require("express"),
  app = express(),
  session = require("express-session"),
  passport = require("passport"),
  Local = require("passport-local").Strategy,
  bodyParser = require("body-parser");
const port = 3000;

let low = require("lowdb"),
  FileSync = require("lowdb/adapters/FileSync"),
  adapter = new FileSync("db.json"),
  db = low(adapter);

db.defaults({ sites: [] }).write();

//test post for a destination
let addSite = {
  city: "Meredith",
  state: "NH",
  description:
    "Stayed in wonderful lakehouse property along Lake Winnipesaukee. Lots to do and the weather was amazing. Looking to buy a house here now!",
  rating: 5,
  id: 0
};

app.use(express.static("public/"));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

const users = [
  { username: "hi", password: "bruh" },
  { username: "yo", password: "mama" }
];

const myLocalStrategy = function(username, password, done) {
  const user = users.find(__user => __user.username === username);

  if (user === undefined) {
    return done(null, false, { message: "user not found" });
  } else if (user.password === password) {
    return done(null, { username, password });
  } else {
    return done(null, false, { message: "incorrect password" });
  }
};

passport.use(new Local(myLocalStrategy));
passport.initialize();

app.post("/login", passport.authenticate("local"), function(req, res) {
  console.log("user:", req.user);
  res.json({ status: true });
});

passport.serializeUser((user, done) => done(null, user.username));

passport.deserializeUser((username, done) => {
  const user = users.find(u => u.username === username);
  console.log("deserializing:", name);

  if (user !== undefined) {
    done(null, user);
  } else {
    done(null, false, { message: "user not found; session not restored" });
  }
});

app.use(
  session({ secret: "cats cats cats", resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

app.post("/test", function(req, res) {
  console.log("authenticate with cookie?", req.user);
  res.json({ status: "success" });
});

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

app.get("/view", function(req, res) {
  let respond = db.get("sites").value();
  let response = JSON.stringify(respond);
  res.end(response);
});

app.listen(process.env.PORT || port);
