const express = require("express"),
  app = express(),
  bodyparser = require("body-parser"),
  session = require("express-session"),
  responseTime = require("response-time"),
  favicon = require("serve-favicon"),
  path = require("path"),
  helmet = require("helmet"),
  slash = require("express-slash"),
  morgan = require("morgan"),
  compression = require("compression");

// New for version a5, without this, nothing works at all.
app.use(bodyparser.urlencoded({
  extended: true
}))

app.use(bodyparser.json());

const mongodb = require("mongodb"); //.MongoClient;
const uri =
  "mongodb+srv://" +
  process.env.USER +
  ":" +
  process.env.PASS +
  "@" +
  process.env.HOST +
  "/" +
  process.env.DB;
const client = new mongodb.MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

let collection = null;
let collection2 = null;

client
  .connect()
  .then(() => {
    // will only create collection if it doesn't exist
    return client.db("test").createCollection("students");
  })
  .then(__collection => {
    // store reference to collection
    collection = __collection;
    // blank query returns all documents
    return collection.find({}).toArray();
  })
  .then(console.log);

client
  .connect()
  .then(() => {
    // will only create collection if it doesn't exist
    return client.db("test").createCollection("users");
  })
  .then(__collection => {
    // store reference to collection
    collection2 = __collection;
    // blank query returns all documents
    return collection2.find({}).toArray();
  })
  .then(console.log);

// Display all requests made in the server console
app.use(morgan("combined"));
// Compression allows for responses to be sent more quickly
app.use(compression());
//Adds in the favicon from a local file, rather than a URL
app.use(
  favicon(
    path.join(
      __dirname,
      "assets",
      "5cd46ecf-8f21-44d2-941d-1799ff06883e%2Ffavicon-a3.ico?v=1568478368998"
    )
  )
);
//Adds in helmet security headers automatically
app.use(helmet());
// Show response time as a response header x-response-time
app.use(responseTime());
// Set up a user session
app.use(
  session({ secret: "secretSession", resave: false, saveUninitialized: false })
);

app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

app.post( '/submit', (req,res) => {
  // submit the initial request to see if the user exists first
  console.log(req.body.name)
  let cookieName = req.headers.cookie;
  cookieName = cookieName.substring(9,cookieName.length)
  collection.find( { student: req.body.name, username: cookieName } ).toArray().then(result => res.json( result ) );
})


app.post( '/add', (req,res) => {
  // insert a new student for the current user 
  let cookieName = req.headers.cookie;
  cookieName = cookieName.substring(9,cookieName.length);
  console.log(req.body);
  let insertValue = {student: req.body.name, username:cookieName, 
                     numberGrade:req.body.numberGrade, letterGrade:alphaFunc(req.body.numberGrade)}
  collection.insertOne( insertValue ).then( result => res.json( {letterGrade: alphaFunc(req.body.numberGrade)} ) )
})

app.post( '/update', (req,res) => {
  // update a student's grades for the current user once it is known to exist 
  let cookieName = req.headers.cookie;
  cookieName = cookieName.substring(9,cookieName.length);
  collection
  .updateOne(
    { username:cookieName, student:req.body.name },
    { $set:{ numberGrade: req.body.numberGrade, letterGrade: alphaFunc(req.body.numberGrade) } }
  ).then( result => res.json( {letterGrade: alphaFunc(req.body.numberGrade)} ) )
})

app.post('/view', (req,res) => {
  // view all students who are assigned to this user
  console.log(req.headers.cookie);
  let cookieName = req.headers.cookie;
  cookieName = cookieName.substring(9,cookieName.length)
  console.log(cookieName);
  collection.find( { username: cookieName } ).toArray().then(result => res.json( result ) );
})

// remove a student
app.delete( '/remove', (req,res) => {
  let cookieName = req.headers.cookie;
  cookieName = cookieName.substring(9,cookieName.length)
  collection
    .deleteOne({ student:( req.body.name ), username:cookieName })
    .then( result => res.json( result ) )
})

// find if a user exists before calling signup
app.post( '/findUser', (req,res) => {
  console.log("finding:" + req.body.username);
  collection2.find({username:req.body.username} ).toArray().then(result => res.json( result )); 
})

// see if the user can be found with the given username and password
app.post( '/login', (req,res) => {
  console.log("login" + req.body.username + req.body.password);
  let userString = req.body.username;
  let passString = req.body.password;
  collection2.find({username:userString, password:passString} ).toArray().then(result => res.json( result )); 
})

// sign a new user up if one does not exist with a given username
app.post( '/signup', (req,res) => {
  console.log(req.body);
   collection2.insertOne( req.body ).then( result => res.json( result ) )
})

const alphaFunc = function (grade) {
    // Get the letter for a student's grade
    let letter;
    if (grade >= 90) {
      letter = "A";
    } else if (grade >= 80) {
      letter = "B";
    } else if (grade >= 70) {
      letter = "C";
    } else if (grade >= 60) {
      letter = "D";
    } else if (grade > -1 && grade !== '') {
      letter = "F";
    } else {
      letter = "N/A";
    }
  return letter;
}

// Enforce strict routing for express-slash
app.enable("strict routing");

// Creating a router using express-slash middleware to handle extra or omitted
// slashes, (/) in the url
const router = express.Router({
  caseSensitive: app.get("case sensitive routing"),
  strict: app.get("strict routing")
});

app.use(router);
app.use(slash());

router.get("/loggedIn.html", function(request, response) {
    if (request.headers.cookie) {
      response.sendFile(__dirname + "/public/loggedIn.html");
    } else {
      response.sendFile(__dirname + "/public/index.html");
    }
});

// Explicitly handle the index file
router.get("/", function(request, response) {
  response.sendFile(__dirname + "/public/index.html");
});

router.get("/index.html", function(request, response) {
  response.sendFile(__dirname + "/public/index.html");
});

app.use(express.static("public"));

app.listen(process.env.PORT);
