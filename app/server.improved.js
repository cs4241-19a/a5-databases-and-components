const express = require("express"),
  session = require("express-session"),
  app = express(),
  bodyparser = require("body-parser"),
  favicon = require("serve-favicon"),
  morgan = require("morgan"),
  passport = require("passport"),
  low = require("lowdb"),
  FileSync = require("lowdb/adapters/FileSync"),
  Local = require("passport-local").Strategy;
const info = low(new FileSync("userData.json"));
const db = low(new FileSync("db.json"));
app.use(express.static("public"));
app.use(morgan("tiny"));
app.use(bodyparser.json());
app.use(favicon(__dirname + "/public/icon.ico"));

//app.get('/data', async function(req, res) {
const MongoClient = require("mongodb").MongoClient;
const uri = process.env.DB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
//let collection = null;
client.connect();

const myLocalStrategy = async function(username, password, done) {
  // db = db.value()
  //const data = client.db('data').collection('users').find().toArray()
  //const user = client.db('data').collection('users').findOne({ username });
  const user = await client
    .db("data")
    .collection("users")
    .findOne({ username });

  if (user === undefined) {
    console.log("user not found");
    return done(null, false, { message: "user not found" });
  } else if (user.password === password) {
    console.log("correct");
    return done(null, { username, password });
  } else {
    console.log("incorrect password");
    return done(null, false, { message: "incorrect password" });
  }
};

passport.use(new Local(myLocalStrategy));
passport.initialize();

passport.serializeUser((user, done) => done(null, user.username));

passport.deserializeUser(async (username, done) => {
  const user = await client
    .db("data")
    .collection("users")
    .findOne({ username });
  console.log("deserializing:", user);

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

app.get("/", function(request, response) {
  // let thepath = path.normalize(__dirname + 'public/index.html');
  // response.sendFile(thepath);
  // response.sendFile( __dirname + 'public/index.html' )

  response.sendFile(response, "public/index.html");
});

app.get("/style.css", function(request, response) {
  response.sendFile(response, "public/css/style.css");
});

app.get("/courses", async function(req, res) {
  if (req.user === undefined) {
    res.redirect(401, "/login.html");
  } else {
    let user = req.user.username;
    res.set("Content-Type", "application/json");
    console.log(info.get("people").value());
    console.log(req.user);
    let ret = await client
      .db("data")
      .collection("courses")
      .findOne({ user });
    res.send(JSON.stringify(ret.courses));
  }
});
app.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/success.html",
    failureRedirect: "/"
  }),
  function(req, res) {
    console.log("Login successful");
    console.log(req.user);
    res.json({ status: true });
  }
);

app.post("/add", async function(req, res) {
  if (req.user === undefined) {
    res.redirect(401, "/login.html");
  } else {
    let user = req.user.username;
    let data = req.body;
    console.log(data);

    await client
      .db("data")
      .collection("courses")
      .updateOne({ user }, { $push: { courses: data } }, { upsert: true });
    let resp = await client
      .db("data")
      .collection("courses")
      .findOne({ user });
    //res.json(resp);
    //client.db('data').collection('courses').find({ user: user }).get("courses").insertOne( data ).then( result => res.json( result ) )

    // info
    //   .get("people")
    //   .find({ user: user })
    //   .get("courses")
    //   .push(data)
    //   .write();
    res.sendStatus(200);
  }
});

app.post("/update/:id", async function(req, res) {
  if (req.user === undefined) {
    res.redirect(401, "/login.html");
  } else {
    let user = req.user.username;
    let data = req.body;

    // info
    //   .get("people")
    //   .find({ user: user })
    //   .get("courses")
    //   .nth(req.params.id)
    //   .assign(data)
    //   .write();
    let nth = req.params.id;

    let selector = {};
    let operator = {};
    selector["courses." + nth] = data; // {'comments.0.num_likes' : 1}
    operator["$set"] = selector; // {'$inc' : {'comments.0.num_likes' : 1} }

    console.log(nth);
    await client
      .db("data")
      .collection("courses")
      .updateOne({ user }, operator);

    // client.db('data').collection('courses').findOne({ user }).courses[req.params.id].assign(data);
    // res.send(JSON.stringify(ret.courses[req.params.id]));
    // ret.courses[req.params.id]=data;

    res.sendStatus(200);
  }
});

app.post("/delete/:id", async function(req, res) {
  if (req.user === undefined) {
    res.redirect(401, "/login.html");
  } else {
    let user = req.user.username;   
    let nth = req.params.id;

    let selector = {};
    let operator = {};
    selector["courses." + nth] = ""; // {'comments.0.num_likes' : 1}
    operator["$unset"] = selector; // {'$inc' : {'comments.0.num_likes' : 1} }

    console.log(nth);
    await client
      .db("data")
      .collection("courses")
      .updateOne({ user }, operator);

    
    await client
      .db("data")
      .collection("courses")
      .updateOne({ user },{$pull : {"courses" : null}})
    
    
    
    res.sendStatus(200);
  }
});

// app.get('/test', async function(req, res) {
//   const MongoClient = require('mongodb').MongoClient;
// const uri = process.env.DB_URI;
// const client = new MongoClient(uri, { useNewUrlParser: true });
//   await client.connect();
//   const data = await client.db('test').collection('devices').find().toArray()
//   res.status(200).send(JSON.stringify(data));
//   await client.close();
// })

app.listen(process.env.PORT || 3000);
console.log("你好");
