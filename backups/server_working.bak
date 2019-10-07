// server.js
// where your node app starts

// init project
const express = require("express");
const mongodb = require("mongodb");
const app = express();

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));
app.use(express.json());

app.use((req, res, next) => {
  if (collection !== null) {
    next();
  } else {
    res.status(503).send();
  }
});

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

const initialList = function(initList){
  
}

var dataSet ={users:[]};

client
  .connect()
  .then(() => {
    // will only create collection if it doesn't exist
    return client.db("test").createCollection("test");
  })
  .then(__collection => {
    // store reference to collection
    collection = __collection;
    // blank query returns all documents
   dataSet = collection.find({}).toArray();
  
    return collection.find({}).toArray();
  })
  .then(console.log);

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

// route to get all docs
app.get("/", (req, res) => {
  if (collection !== null) {
    // get array and pass to res.json
    collection
      .find({})
      .toArray()
      .then(result => res.json(result));
  }
  
  //res.sendFile(__dirname + "/views/index.html");
});

app.get("/getAll", (req, res) => {
  if (collection !== null) {
    collection
      .find({})
      .toArray()
      .then((result) => {
        //console.log("------------------ responding with all data: ", result);
        //res.json(result)
        res.send(result);
    });
  }
})

app.post("/clickerish", (request,response)=>{
  response.sendFile(__dirname + "/views/index.html");
})

app.post("/add", (request, response) => {
  collection
    .insertOne({
      username: request.body.username,
      password: request.body.password
    })
    .then(result => response.json(result));
});

// assumes req.body takes form { _id:5d91fb30f3f81b282d7be0dd } etc.
app.post("/remove", (request, response) => {  
   collection
    .deleteOne({ _id:mongodb.ObjectID( request.body._id ) })
    .then( result => response.json( result ) )
  response.sendFile(__dirname + "/views/index.html");
});

app.post("/update", (req, res) => {
  collection
    .updateOne(
      { _id: mongodb.ObjectID(req.body._id) },
      { $set: { username: req.body.username, password:req.body.password} }
    )
    .then(result => res.json(result));
});

app.listen(3000);

/*
// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});*/
