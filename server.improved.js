const express = require("express"),
  path = require("path"),
  http = require("http"),
  app = express(),
  port = process.env.PORT || 3000,
  session = require("express-session"), //middleware for authentication
  passport = require("passport"), // middleware for authentication
  Local = require("passport-local").Strategy,
  bodyParser = require("body-parser"),
  morgan = require("morgan"), // middleware for logging HTTP requests
  helmet = require("helmet"), // middleware for setting HTTP headers
  responseTime = require("response-time"), // middleware for HTTP request response time
  StatsD = require("node-statsd"), // middleware for HTTP request response time
  mongodb = require("mongodb"),
  mime = require("mime"),
  dotenv = require("dotenv");

dotenv.config();

const uri =
  "mongodb+srv://anagha:" +
  process.env.MONGO_PASS +
  "@cluster0-vy0ms.azure.mongodb.net/admin?retryWrites=true&w=majority";

const client = new mongodb.MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
let currentUser = "";
let ordersCollection = null;
let usersCollection = null;

client
  .connect()
  .then(() => {
    return client.db("a5").createCollection("users");
  })
  .then(__collection => {
    usersCollection = __collection;
  });

client
  .connect()
  .then(() => {
    return client.db("a5").createCollection("orders");
  })
  .then(__collection => {
    ordersCollection = __collection;
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

app.get("/orders", function(req, res) {
  if (ordersCollection !== null) {
    ordersCollection
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
    const newOrder = JSON.parse(dataString);

    let numOrders = 0;

    ordersCollection
      .find({})
      .toArray()
      .then(result => {
        numOrders = result.length;

        const order = {
          username: newOrder.username,
          beds: newOrder.beds,
          requests: newOrder.requests,
          id: numOrders + 1,
          createdBy: currentUser
        };

        ordersCollection.insertOne(order).then(result => res.json(result));
      });
  });
});

app.post("/update", function(req, res) {
  let dataString = "";
  req.on("data", function(data) {
    dataString += data;
  });

  req.on("end", function() {
    const updatedOrder = JSON.parse(dataString);

    ordersCollection
      .updateOne(
        { id: updatedOrder.id },
        {
          $set: {
            username: updatedOrder.username,
            beds: updatedOrder.beds,
            requests: updatedOrder.requests
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
    const deleteThisOrder = JSON.parse(dataString);

    ordersCollection
      .deleteOne({ id: deleteThisOrder.id })
      .then(result => res.json(result));
  });
});

const myLocalStrategy = function(username, password, done) {
  let user;
  usersCollection
    .find({})
    .toArray()
    .then(result => {
      user = result[0];
      console.log("Username: " + result);

      if (user.username === username && user.password === password) {
        currentUser = username;
        return done(null, { username, password });
      } else {
        return done(null, false, { message: "wrong password" });
      }
    });
};

passport.use(new Local(myLocalStrategy));

passport.serializeUser((user, done) => done(null, user.username));

passport.deserializeUser((username, done) => {
  let user;
  usersCollection
    .find({})
    .toArray()
    .then(result => {
      user = result[0];
      console.log("Query result: " + result)

      if (user !== undefined) {
        done(null, user);
      } else {
        done(null, false, { message: "no such user exists" });
      }
    });
});

app.use(
  session({
    secret: "supercalifragilesticexpialadocious",
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
  console.log("server started running");
});
