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


var mongo = require('mongodb').MongoClient;
// mongodb+srv://<jrbartone2>:<Joeyryan22>@cluster0-motd9.azure.mongodb.net/test?retryWrites=true&w=majority
// mongodb+srv://<username>:<password>@cluster0-motd9.azure.mongodb.net/test?retryWrites=true&w=majority
const uri = "mongodb+srv://jrbartone:Joeyryan22@cluster0-motd9.azure.mongodb.net/test?retryWrites=true&w=majority"



function mongoDB(mongo, action, type, payload){
  switch(action){
    case "insert":
       mongo.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, client) {
       if(err) {
            console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
       }
       console.log('Connected...');
       if(type == "users"){
         client.db("mydb").collection("users").insertOne(payload);
       }
       if(type == "data"){
         client.db("mydb").collection("data").insertOne(payload);
       }
       client.close();
       console.log('inserted data!');
    });
       break;
    case "remove":
       mongo.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, client) {
       if(err) {
            console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
       }
       console.log('Connected...');
       if(type == "users"){
         client.db("mydb").collection("users").deleteOne(payload)
       }
       if(type == "data"){
         client.db("mydb").collection("data").deleteOne(payload)
       }
       client.close();
       console.log('inserted data!');
      });
      break;
    case "sync":
       let array = []
       mongo.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, client) {
       if(err) {
            console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
       }
       console.log('Connected...');
       if(type == "users"){
          client.db("mydb").collection("users").find({}).toArray(function(err, result){
            array = result
            allUsers = array
          })
       }
       if(type == "data"){
          array = client.db("mydb").collection("data").find({}).toArray(function(err, result){
            array = result
            appdata = array
          })
       }
       client.close();
       console.log('got data!');
      });
      return (array);
    case "find":
       let instance;
       mongo.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, client) {
       if(err) {
            console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
       }
       console.log('Connected...');
       if(type == "users"){
         instance = client.collection("users").find(payload);
       }
       if(type == "data"){
         instance = client.collection("data").find(payload);
       }
       client.close();
       console.log('got one!');
      });
      return instance;
  }
}

function donothing(){}

// MIDDLEWEAR .USE
//app.use(timeout('5s'))
app.use(express.static('public'));
app.use("/assets", assets);
app.use(passport.initialize())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet())

function haltOnTimedout (req, res, next) {
  if (!req.timedout) next()
}

// READ FROM DB INTO LOCAL STORAGE
function syncAllUsers(){
  let arr = mongoDB(mongo, "sync", "users", null)
  return arr
}

// READ FROM DB INTO LOCAL STORAGE
function syncAllData(){
  let arr = mongoDB(mongo, "sync", "data", null)
  return arr
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
app.post('/submit', function (req, res) {
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
        let payload = {word:body.word, lang: body.lang, translation: "", action: body.action, id:body.id, user:body.user};        
        console.log(appdata)
        console.log("translate")
        translateWord(body.word, body.lang).then(function(retVal){
            payload.translation += retVal;
            res.writeHead( 200, "OK", {'Content-Type': 'text/plain' });
            mongoDB(mongo, "insert", "data", payload)
            setTimeout(function(){
            console.log("New data inserted in the database");
            mongoDB(mongo, "sync", "data", null)
            setTimeout(function(){
            res.end(JSON.stringify(payload));
              }, 1000);
            }, 1000);

          });
        break;
      case "delete":
        console.log("delete")
        let i = 0;
        let id = body.id
        console.log(body.id)
        for (i = 0; i < appdata.length; i++){
          if (JSON.stringify(appdata[i]).includes("" + id)){
             let myQuery = {id: id, user: currentSession[0]};
             mongoDB(mongo, "remove", "data", myQuery)
             setTimeout(function(){
             console.log("Data torched from the database");
              }, 1000);
             mongoDB(mongo, "sync", "data", null)
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
            let myQuery = {id: id, user: currentSession[0]};
            mongoDB(mongo, "remove", "data", myQuery)
            setTimeout(function(){
            console.log("Data torched from the database");
               }, 1000);
            mongoDB(mongo, "sync", "data", null)
          }
        }
        //console.log(editWord)
        let editedLoad = {word:editWord, lang: body.lang, translation: "", action: body.action, id:body.id, user: body.user};
        translateWord(editWord, body.lang).then(function(retVal){
            editedLoad.translation += retVal;
            res.writeHead( 200, "OK", {'Content-Type': 'text/plain' });
            mongoDB(mongo, "insert", "data", editedLoad)
            setTimeout(function(){
            console.log("New data inserted in the database");
            mongoDB(mongo, "sync", "data", null)
            setTimeout(function(){
            res.end(JSON.stringify(editedLoad));
              }, 1000);
            }, 1000);
          });
        break;
    }
    //end of switch case
  })
  //end of datastream
})


// HANDLE LOGIN

app.post('/login', 
         function (req, res) {
            //console.log(req.body)
            mongoDB(mongo, "sync", "users", null)
            setTimeout(function(){
            console.log(allUsers)
            console.log("handlig log")
            let data = req.body
            //console.log(data)
              if(allUsers.length > 0){
                for (let i = 0; i < allUsers.length; i++){
                  let obj = (allUsers[i])
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
              
            }, 2000);
  
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
      // MONGO
        db.get('users')
          .push({ username: data.user, password: data.pass })
          .write()
        console.log("New user inserted in the database");
        data = JSON.stringify(data)
        allUsers.push(data)
        res.send("OK")
    }
    else{
            // MONGO

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
