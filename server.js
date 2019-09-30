// server.js
// where your node app starts

// init project
var favicon = require('serve-favicon')
var path = require('path')
const express = require('express')
const session = require('express-session')
const bodyParser = require('body-parser')
const low = require('lowdb')
const FileAsync = require('lowdb/adapters/FileAsync')
const app = express();
app.use(bodyParser.json())
let currentSession = ["", ""]
let allUsers = []
const admin = {user:"admin", pass:"admin"}
let me = JSON.stringify(admin)
let entry = {"word":"a","lang":"en-sq","translation":"një","action":"translate","id":1,"user":"admin"}
let appdata = []
var FileSync = require('lowdb/adapters/FileSync')
var adapter = new FileSync('.data/db.json')
var db = low(adapter)
var Strategy = require('passport-local').Strategy;
var passport = require('passport');
var assets = require("./assets");
var timeout = require('connect-timeout')
const helmet = require('helmet')


// MIDDLEWEAR .USE
app.use(timeout('5s'))
app.use(express.static('public'));
app.use(favicon(path.join(__dirname, 'assets', 'glo.ico')))
app.use("/assets", assets);
app.use(passport.initialize())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet())

function haltOnTimedout (req, res, next) {
  if (!req.timedout) next()
}


// SET DEFAULT DB USERS
db.defaults({ users: [
      {"username":"admin", "password":"admin"}
    ]
  }).write();

// SET DEFAULT DB DATA
db.defaults({ data: [
      {"word":"","lang":"","translation":"","action":"","id":"","user":""}
    ]
  }).write();

// LOCAL PASSPORT CHECK STRATEGY
passport.use(new Strategy(
  {
    usernameField: 'username',
    passwordField: 'password'
    //,passReqToCallback: true
  },
  function(username, password, done) {
   let user = db.get('users').find({username: username, password:password}).value()
      if (user.password != password) { return done(null, false); }
      return done(null, user);
  }
));

//PASSPORT CONFIG
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

// READ FROM DB INTO LOCAL STORAGE
function syncAllUsers(){
  allUsers = []
  var users = db.get('users').value() // Find all users in the collection
  users.forEach(function(user) {
    allUsers.push(JSON.stringify({username : user.username, password: user.password})); // adds their info to the dbUsers value
  });
  return allUsers
}

// READ FROM DB INTO LOCAL STORAGE
function syncAllData(){
  appdata = []
  var dataset = db.get('data').value() // Find all users in the collection
 if(dataset !== undefined){
    console.log("sync...")
    dataset.forEach(function(data) {
    appdata.push(({"word":data.word,"lang":data.lang,"translation":data.translation,"action":data.action,"id":data.id,"user":data.user})); // adds their info to the dbUsers value
  });
  return appdata
 }
  else{
    console.log("no data")
    return appdata
  }
}

// TRANSLATION API
const translateWord = function(word, lang){
  return new Promise(function(resolve, reject){
        var url = "https://translate.yandex.net/api/v1.5/tr.json/translate",
        keyAPI = "trnsl.1.1.20190907T141217Z.e39e2bd5353a5df3.d131c190bafbb7bf7eaf7b11c9c2122ea683c7dd";
        var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
        let xhr = new XMLHttpRequest(),
            textAPI = encodeURI(word),
            langAPI = lang
            let req = 'key='+keyAPI+'&text='+textAPI+'&lang='+langAPI;
        xhr.open("POST",url,true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(req);
        xhr.onreadystatechange = function() {
            if (this.readyState==4) {
                let res = this.responseText;
                var json = JSON.parse(res);
                //console.log(json.text[0]);
                resolve( json.text[0])
            }
        }
  });
}

// ROUTING HERE
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/home.html');
});

app.get('/index.html', function(request, response) {
  appdata = syncAllData();
  response.sendFile(__dirname + '/views/index.html');
});

app.get('/login.html', function(request, response) {
  response.sendFile(__dirname + '/views/login.html');
});

app.get('/about.html', function(request, response) {
  response.sendFile(__dirname + '/views/about.html');
});

app.get('/create.html', function(request, response) {
  response.sendFile(__dirname + '/views/create.html');
});


// TRANSLATION SUBMISSION
app.post('/submit',timeout('5s'),haltOnTimedout, function (req, res) {
  //
  let dataString = ''
  req.on( 'data', function( data ) {
      dataString += data 
  })
  req.on( 'end', function() {
    let body = JSON.parse( dataString )
    var translation = ""
    
    switch(body.action){
      case "translate":
        if (req.timedout) return
        console.log(appdata)
        console.log("translate")
        let payload = {word:body.word, lang: body.lang, translation: "", action: body.action, id:body.id, user:body.user};
        translateWord(body.word, body.lang).then(function(retVal){
            payload.translation += retVal;
            res.writeHead( 200, "OK", {'Content-Type': 'text/plain' });
              db.get('data')
                .push(payload)
                .write()
              console.log("New data inserted in the database");
             appdata = syncAllData();
            res.end(JSON.stringify(payload));
          });
        break;
      case "delete":
         
        console.log("delete")
        let i = 0;
        let id = body.id
        console.log(body.id)
        for (i = 0; i < appdata.length; i++){
          if (JSON.stringify(appdata[i]).includes("" + id)){
             db.get('data')
                .remove(appdata[i])
                .write()
              console.log("Data torched from the database");
             appdata = syncAllData();
          }
        }
        break;
        
      case "edit":
        console.log("edit")
        let k = 0;
        let j = body.id
        let editWord = ""
        for (k = 0; k < appdata.length; k++){
          if (JSON.stringify(appdata[k]).includes("" + j)){
            console.log("k" + appdata[k])
            editWord = appdata[k].word //this is undefined?????
             db.get('data')
                .remove(appdata[k])
                .write()
              console.log("Edit torched from the database");
             appdata = syncAllData();
          }
        }
        //console.log(editWord)
        let editedLoad = {word:editWord, lang: body.lang, translation: "", action: body.action, id:body.id, user: body.user};
        translateWord(editWord, body.lang).then(function(retVal){
            editedLoad.translation += retVal;
            res.writeHead( 200, "OK", {'Content-Type': 'text/plain' });
             db.get('data')
                .push(editedLoad)
                .write()
              console.log("New edit inserted in the database");
            appdata = syncAllData();
            console.log(appdata)
            res.end(JSON.stringify(editedLoad));
          });
        break;
    }
    //end of switch case
  })
  //end of datastream
})


// HANDLE LOGIN

app.post('/login', 
         passport.authenticate('local'),
         function (req, res) {
  console.log(req.body)
  allUsers = syncAllUsers()
  console.log((allUsers))
  console.log("handlig log")
  let data = req.body
  console.log(data)
    if(allUsers.length > 0){
      for (let i = 0; i < allUsers.length; i++){
        let obj = JSON.parse(allUsers[i])
        if (obj.username == data.username && obj.password == data.password){
          currentSession[0] = data.username;
          currentSession[1] = data.password;
          console.log(" login")
          res.send("OK")
          //send all packets of user data
          return
        }
        else{
          //console.log("bad login")
          //res.send("BAD")
        }
      }
       console.log("bad login")
       res.send("BAD")
       return
    }
    else{
       console.log("bad login")
       res.send("BAD")
       return
    }
  //})
})


//HANDLE ACCOUNT CREATION
app.post('/create', function (req, res) {
  console.log("creating acc")
  let dataString = ''
  req.on( 'data', function( data ) {
      dataString += data 
  })
  req.on( 'end', function() {
  let data = JSON.parse(dataString)
  console.log(data)
    if(allUsers.length > 0){
      for (let i = 0; i < allUsers.length; i++){
        let obj = JSON.parse(allUsers[i])
        if (obj.user == data.user){
          console.log(" login")
          res.end("BAD")
          return
        }
      }
        db.get('users')
          .push({ username: data.user, password: data.pass })
          .write()
        console.log("New user inserted in the database");
        data = JSON.stringify(data)
        allUsers.push(data)
        res.send("OK")
    }
    else{
         db.get('users')
          .push({ username: data.user, password: data.pass })
          .write()
        console.log("New user inserted in the database");
        data = JSON.stringify(data)
        allUsers.push(data)
        res.send("OK")
      return
    }
  })
})


app.post('/userData', function (req, res) {
  let pack = JSON.stringify(appdata)
  console.log(pack)
  console.log(appdata)
  res.end(pack)
})


app.post('/queryLogin', function (req, res) {
  console.log(currentSession.join(','))
  res.end(currentSession.join(','))
})


var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
