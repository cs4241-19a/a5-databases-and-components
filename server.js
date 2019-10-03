const html = require('html'),
    mime = require('mime'),
    express = require('express'),
    server = express(),
    bodyparser = require('body-parser'),
    low = require('lowdb'),
    FileSync = require('lowdb/adapters/FileSync'),
    adapter = new FileSync('db.json'),
    db = low(adapter),
    morgan = require('morgan');

var jobs = [];

const uri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+'/'+process.env.DB;

// Packages to use
server.use(morgan('dev'));
server.use(express.static('public'));
server.use(bodyparser.json());

// Setting defaults for empty JSON file
db.defaults({ jobs: [], count: 0})
  .write();

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
    let dupe = db.get('jobs').find({job: req.body.job}).value();
    if(typeof(dupe) != 'undefined') {
      db.get('jobs')
        .remove({job: req.body['job']})
        .write();
      jobs = jobs.filter(function(value, index, arr) {
        return value.job != req.body['job'];
      })
      console.log(jobs);
    }
    jobs.push(req.body);
    db.get('jobs')
      .push(req.body)
      .write();
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(jobs));
});

// Updating server memory from file
db.get('jobs').value().forEach(job => {
  jobs.push(job);
});

console.log('Current jobs stored are listed below');
console.log(jobs);
server.listen(process.env.PORT || 3000);
