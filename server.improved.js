const http = require("http"),
  fs = require("fs"),
  // IMPORTANT: you must run `npm install` in the directory for this assignment
  // to install the mime library used in the following line of code
  mime = require("mime"),
  dir = "public/",
  port = 3000,
  Express = require("express"),
  app = Express(),
  bodyParser = require("body-parser");
app.use(Express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

let appdata = [];

const newData = [];

const mongodb = require("mongodb");

const uri =
  "mongodb+srv://admin:9Ul2naEpjsYlr0dr@cluster0-dvaje.azure.mongodb.net/admin?retryWrites=true&w=majority";

const client = new mongodb.MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
let collection = null;

client
  .connect()
  .then(() => {
    // will only create collection if it doesn't exist
    return client.db("size").createCollection("class_size");
  })
  .then(__collection => {
    // store reference to collection
    collection = __collection;
    // blank query returns all documents
    return collection.find({}).toArray();
  })
  .then(console.log);

app.get("/", function(request, response) {
  sendFile(response, "public/index.html");
});

app.post("/submit", function(request, response) {
  let json = {
    name: request.body.yourname,
    year: request.body.classyear,
    inches: request.body.height
  };
  collection.remove({ name: request.body.yourname }).then(result => result);
  collection.insertOne(json).then(result => result);
  let dong;
  if (collection !== null) {
    // get array and pass to res.json
    console.log("hello");
    dong = collection
      .find({})
      .toArray()
      .then(result => {
        return result;
      });
    dong.then(function(result) {
      console.log("inserted is ", result);
    });
  }
});

app.post("/delete", function(request, response) {
  let json = { name: request.body.delName, year: 200, inches: 0 };
  collection.remove({ name: request.body.delName }).then(result => result);
  let dong;
  if (collection !== null) {
    // get array and pass to res.json
    console.log("hello");
    dong = collection
      .find({})
      .toArray()
      .then(result => {
        return result;
      });
    dong.then(function(result) {
      console.log("inserted is ", result);
    });
  }
});

app.get("/data", function(request, response) {
  console.log("Pre newData is ");
  console.log(newData);
  let donge = [];
  if (collection !== null) {
    // get array and pass to res.json
    console.log("hello");
    donge = collection
      .find({})
      .toArray()
      .then(result => {
        return result;
      });
    donge.then(function(result) {
      console.log("appdata is ", result);
      appdata = result;
    });
  }

  appdata.forEach(function(item) {
    newData.push({
      name: item.name,
      year: item.year,
      inches: item.inches,
      cm: item.inches * 2.54
    });
  });

  while (newData.length !== appdata.length) {
    newData.shift();
  }

  console.log("Post newData is ");
  console.log(newData);
  console.log(appdata);

  response.send(newData);
});

const sendFile = function(response, filename) {
  const type = mime.getType(filename);

  fs.readFile(filename, function(err, content) {
    // if the error = null, then we've loaded the file successfully
    if (err === null) {
      // status code: https://httpstatuses.com
      response.writeHeader(200, { "Content-Type": type });
      response.end(content);
    } else {
      // file not found, error code 404
      response.writeHeader(404);
      response.end("404 Error: File Not Found");
    }
  });
};

app.listen(process.env.PORT || port);
