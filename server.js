const html = require('html'),
    mime = require('mime'),
    express = require('express'),
    server = express(),
    bodyparser = require('body-parser'),
    morgan = require('morgan'),
    mongodb = require('mongodb');

var jobs = [];

//const uri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+'/'+process.env.DB;
const uri = 'mongodb+srv://demo:demopassword@trackera5-hpm35.mongodb.net/test?retryWrites=true&w=majority'

const client = new mongodb.MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology:true});
let collection = null;

// Connecting to MongoDB
client.connect()
  .then(() => {
    // will only create collection if it doesn't exist
    return client.db('webwareA5').createCollection('jobs');
  })
  .then( __collection => {
    // store reference to collection
    collection = __collection;
    // blank query returns all documents
    return collection.find({}).toArray();
  })
  .then(array => {
    console.log(array);
    jobs = array;
  });

// Middleware
server.use(morgan('dev'));
server.use(express.static('public'));
server.use(bodyparser.json());
server.use((req,res,next) => {
  if(collection !== null) {
    next();
  }
  else{
    res.status(503).send();
  };
});

// Explicity handle domain name
server.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/views/index.html');
});

// Handling requests for job data for tables
server.get('/tables', function(req, res) {
  res.writeHead(200, {'Content-Type': 'application/json'});
  res.end(JSON.stringify(jobs));
});

// Handling posts from form submissions
server.post('/submit', bodyparser.json(),
  function(req, res) {
    let dupe = jobs.filter(function(value, index, arr) {
      return value.job === req.body['job'];
    });
    if(dupe.length != 0) {
      collection.deleteOne({job: req.body['job']});
      jobs = jobs.filter(function(value, index, arr) {
        return value.job != req.body['job'];
      });
      console.log(jobs);
    }

    jobs.push(req.body);
    collection.insertOne(req.body);
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(jobs));
});

console.log('Current jobs stored are listed below');
console.log(jobs);
server.listen(process.env.PORT || 3000);
