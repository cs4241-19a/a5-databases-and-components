const http = require( 'http' ),
      fs   = require( 'fs' ),
      mime = require( 'mime' ),
      TAFFY = require('taffy'),
      express = require('express'),
      app = express(),
      dir  = 'public/',
      FileSync = require('lowdb/adapters/FileSync'),
      adapter = new FileSync('public/resources/db.json'),
      serveStatic = require('serve-static'),
      cookieSession = require('cookie-session'),
      path = require('path'),
      morgan = require('morgan'),
      cookieParser = require('cookie-parser'),
      session = require('express-session'),
      timeout = require('connect-timeout'),
      port = 3000,    
      MongoClient = require('mongodb').MongoClient,
      uri = "mongodb+srv://jharnois:testingPassword@cluster0-qjlcv.mongodb.net/test?retryWrites=true&w=majority";

app.use(require('body-parser').urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(cookieParser())
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
}))
app.use(timeout(10000));
app.use(haltOnTimedout);

function haltOnTimedout(req, res, next){
  console.log("oh no! Timeout!")
  if (!req.timedout) next();
}

var sendjson = {}

const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("db").collection("classes");
  client.close();
});

app.get('/', function(req, res) {
    res.sendFile('public/views/index.html', {root : '.'})
});
app.get('/scripts.js', function(req, res) {
    res.sendFile('public/js/scripts.js', {root : '.'})
});
app.get('/db.json', function(req, res) {
    res.sendFile('public/resources/db.json', {root : '.'})
});
app.get('/style.css', function(req, res) {
    res.sendFile('public/css/style.css', {root : '.'})
});
app.get('/pass.js', function(req, res) {
    res.sendFile('public/js/pass.js', {root : '.'})
});
app.get('/logo.png', function(req, res) {
    res.sendFile('public/resources/img/logo.png', {root : '.'})
});
app.get('/kap', function(req, res) {
    res.sendFile('public/resources/img/kap', {root : '.'})
});
app.get('/ak.jpg', function(req, res) {
    res.sendFile('public/resources/img/ak.jpg', {root : '.'})
});
app.get('/index', function(req, res) {
    res.sendFile('public/views/index.html', {root : '.'})
    req.session.views = (req.session.views || 0) + 1
    console.log(req.session.views + ' views')
    var storeJson = {}
    storeJson["cookie"] = req.cookies;
    storeJson["signed"] = req.signedCookies;
    db.get("cookies").push(storeJson).write()
});

app.post('/submit', function(request, response) {
  let dataString = ''
  let flag = 0;
  request.on( 'data', function( data ) {
      dataString += data 
  })
  request.on( 'end', function() {
    let inputData = JSON.parse( dataString )
    let action = inputData.action
    console.log(inputData)
     if(action.includes('a')){
       sendjson['action'] = "a"    
       let dept = inputData.dept
       let prof = inputData.prof
       let room = inputData.room
       let myEnt = {}
       myEnt["Department"] = dept;
       myEnt["Professor"] = prof
       myEnt["Room"] = room
       console.log(myEnt)
       const client = new MongoClient(uri, { useNewUrlParser: true });
       client.connect(err => {
         const collection = client.db("db").collection("classes");
         collection.insertOne(myEnt, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
         })
         client.close();
       });
     }
     else if(action.includes('m')){
      sendjson['action'] = "m"
      let cat = inputData.category;
      let catTwo = inputData.secCategory;
      let inputVal = inputData.input;
      let catObj = {},
          secObj = {};
      catObj[cat] = catTwo;
      secObj[cat] = inputVal;
      const client = new MongoClient(uri, { useNewUrlParser: true });
      client.connect(err => {
        const collection = client.db("db").collection("classes");
        collection.update(catObj, {$set: secObj});
        client.close();
      });
     }
     else{
      sendjson['action'] = "d"    
       let cat = inputData.category;
       let catTwo = inputData.secCategory;
       let catObj = {};
       catObj[cat] = catTwo;
       let updateObj = {}
       updateObj[cat] = null;
       console.log(catObj)
       const client = new MongoClient(uri, { useNewUrlParser: true });
       client.connect(err => {
         const collection = client.db("db").collection("classes");
         collection.deleteOne(catObj);
         client.close();
       });
     }
       response.writeHead( 200, "OK", {'Content-Type': 'application/json', 'charset':'UTF-8'});
       const client = new MongoClient(uri, { useNewUrlParser: true });
       client.connect(err => {
         const collection = client.db("db").collection("classes");
         collection.find().toArray((err, items) => {
          console.log("inside")
          sendjson["classes"] = items;
          response.end(JSON.stringify(sendjson));
        })
         client.close();
       });
    })
});

app.listen(port || 3000)


// [
//   { "Department" : "CS1101",
//   "Professor"  : "bob",
//   "Room" : "AK116"
// },
// { "Department"  : "ME1800",
//   "Professor"  : "Jill",
//   "Room" : "SL115"
// },
// { "Department"  : "CS2303",
//   "Professor"  : "Andres",
//   "Room" : "OH107"
// },
// { "Department"  : "PSY1401",
//   "Professor"  : "Brian",
//   "Room" : "SL315"
// },
// { "Department"  : "RBE1001",
//   "Professor"  : "Megan",
//   "Room" : "Flupper"
// },
// { "Department"  : "ECE2049",
//   "Professor"  : "Sam",
//   "Room" : "Flower"
// },
// { "Department"  : "CS4801",
//   "Professor"  : "Emily",
//   "Room" : "AK232"
// }
// ]