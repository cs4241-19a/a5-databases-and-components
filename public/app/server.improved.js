const express = require("express");
const path = require("path");
const http = require("http");
const app = express();
const port = process.env.PORT || 3000;
const mongodb = require("mongodb");
//const FileSync = require("lowdb/adapters/FileSync");
const session = require("express-session");
const passport = require("passport");
const Local = require("passport-local").Strategy;
const bodyParser = require("body-parser");
const helmet = require("helmet");
const morgan = require("morgan");
//const responseTime = require("response-time");
//const StatsD = require("node-statsd");
const mime = require("mime");
const mongoose = require("mongoose");

const uri =
  "mongodb+srv://assignment5:webware@cluster0-ifsyg.azure.mongodb.net/admin?retryWrites=true&w=majority";

const client = new mongodb.MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
let currentUser = "";
let notesCollection = null;
let usersCollection = null;

client
  .connect()
  .then(() => {
    return client.db("A5").createCollection("notes");
  })
  .then(__collection => {
    notesCollection = __collection;
  });

client
  .connect()
  .then(() => {
    return client.db("A5").createCollection("users");
  })
  .then(__collection => {
    usersCollection = __collection;
  });

app.use(express.static(path.join(__dirname + "/public")));
app.use(bodyParser.json());
app.use(helmet());
app.use(morgan("combined"));

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname + "/public/index.html"));
});

app.get("/js/scripts.js", function(req, res) {
  res.sendFile(path.join(__dirname + "/js/scripts.js"));
});

app.get("/notes", function(req, res) {
  if (notesCollection !== null) {
    notesCollection
      .find({})
      .toArray()
      .then(result => res.json(result));
  }
});

app.post("/submit", function(req, res) {
  let dataString = "";
  req.on("data", function(data) {
    dataString += data;
  });

  req.on("end", function() {
    const newNote = JSON.parse(dataString);
    let numberOfNotes = 0;

    notesCollection
      .find({})
      .toArray()
      .then(result => {
        numberOfNotes = result.length;

        const note = {
          noteEntry: newNote.noteEntry,
          date: newNote.date,
          id: numberOfNotes + 1,
          createdBy: currentUser
        };

        notesCollection.insertOne(note).then(result => res.json(result));
      });
  });
});

app.post("/update", function(req, res) {
  let dataString = "";
  req.on("data", function(data) {
    dataString += data;
  });

  req.on("end", function() {
    const updatedNote = JSON.parse(dataString);

    notesCollection
      .updateOne(
        { id: updatedNote.id },
        {
          $set: {
            username: updatedNote.username,
            noteEntry: updatedNote.noteEntry,
            date: updatedNote.date
          }
        }
      )
      .then(result => res.json(result));
  });
});

app.post("/delete", function(req, res) {
  let dataString = "";
  req.on("data", function(data) {
    dataString += data;
  });

  req.on("end", function() {
    const deleteThisNote = JSON.parse(dataString);

    notesCollection
      .deleteOne({ id: deleteThisNote.id })
      .then(result => res.json(result));
  });
});

const myLocalStrategy = function(username, password, done) {
  let user;
  notesCollection
    .find({})
    .toArray()
    .then(result => {
      user = result[0];

      if (user.username === username && user.password === password) {
        currentUser = username;
        return done(null, { username, password });
      } else {
        return done(null, false, {
          message: "Incorrect Password, Try Again"
        });
      }
    });
};

passport.use(new Local(myLocalStrategy));

passport.serializeUser((user, done) => done(null, user.username));

passport.deserializeUser((username, done) => {
  let user;
  notesCollection
    .find({})
    .toArray()
    .then(result => {
      user = result[0];

      if (user !== undefined) {
        done(null, user);
      } else {
        done(null, false, {
          message: "User not found; session not restored"
        });
      }
    });
});

app.use(
  session({
    secret: "supersecretnotes",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.post("/login", passport.authenticate("local"), function(req, res) {
  res.json({ status: true });
});

let server = http.createServer(app);
server.listen(port, function() {
  console.log("server is running");
});
