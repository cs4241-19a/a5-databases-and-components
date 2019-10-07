//express and middleware
const express = require("express"),
  app = express(),
  session = require("express-session"),
  passport = require("passport"),
  Local = require("passport-local").Strategy,
  bodyParser = require("body-parser"),
  cors = require("cors"),
  mongodb = require("mongodb");
bcrypt = require("bcrypt");
const port = 3000;

//mongodb
let collUsers = null;
let collSites = null;
const uri =
  "mongodb+srv://AndrewLevy395:Nernerboy1997@cluster0-ikdc7.mongodb.net/test?retryWrites=true&w=majority";
const client = new mongodb.MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  collSites = client.db("a5").collection("sites");
  collUsers = client.db("a5").collection("users");
  client.close;
});

//set database defaults when empty

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
  collUsers.findOne({ username: username }, function(err, user) {
    if (err) {
      return done(err);
    }
    if (!user) {
      return done(null, false, { message: "incorrect username" });
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
  });
};

passport.use(new Local(myLocalStrategy));

app.post("/login", passport.authenticate("local"), function(req, res) {
  res.json({ status: true });
});

passport.serializeUser((user, done) => done(null, user.username));

passport.deserializeUser((username, done) => {
  collUsers.findOne({ username: username }, function(err, user) {
    if (err) {
      return done(err);
    }
    if (user !== undefined) {
      done(null, user);
    } else {
      done(null, false, { message: "user not found; session not restored" });
    }
  });
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

  collSites.find({ city: data.city }).toArray(function(err, wat) {
    if (err) {
      return done(err);
    }
    for (let i = 0; i < wat.length; i++) {
      if (wat[i].state_ === data.state_ && wat[i].user_ === data.user_) {
        change = 1;
      }
    }

    if (change === 0) {
      collSites.insertOne(data).then(result => res.json(result));
      console.log("Succesfully Added");
    } else {
      console.log("Site Already Exists");
      response = JSON.stringify({ status: "failure" });
      res.end(response);
    }
  });
});

//add user using BCRYPT
app.post("/add", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const data = { username: req.body.username, password: hashedPassword };
    collUsers.insertOne(data).then(result => res.json(result));
  } catch {
    res.status(500).send();
  }
});

//remove location
app.post("/remLoc", function(req, res) {
  let data = req.body;

  collSites.findOne({ uid: data.uid }, function(err, bdata) {
    if (err) {
      return done(err);
    }

    collSites
      .deleteOne({ _id: mongodb.ObjectID(bdata._id) })
      .then(result => res.json(result));
  });
});

//modify location
app.post("/modLoc", function(req, res) {
  let data = req.body;

  collSites.updateMany(
    { uid: data.uid },
    { $set: { rating: data.rating, desc: data.desc } }
  );
});

//get and review databse sites
app.get("/view", function(req, res) {
  collSites.find({}).toArray(function(err, respond) {
    if (err) {
      return done(err);
    }

    let response = JSON.stringify(respond);
    res.end(response);
  });
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
