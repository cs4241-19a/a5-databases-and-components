const http = require( 'http' ),
      fs   = require( 'fs' ),
      mime = require( 'mime' ),
      TAFFY = require('taffy'),
      express = require('express'),
      app = express(),
      dir  = 'public/',
      passport = require('passport'),
      low = require('lowdb'),
      FileSync = require('lowdb/adapters/FileSync'),
      adapter = new FileSync('public/resources/db.json'),
       serveStatic = require('serve-static'),
      cookieSession = require('cookie-session'),
      path = require('path'),
       morgan = require('morgan'),
      cookieParser = require('cookie-parser'),
      db = low(adapter),
     /**/ session = require('express-session'),
      timeout = require('connect-timeout'),
      port = 3000    

var GitHubStrategy = require('passport-github2').Strategy;

db.defaults({"users":[]}, {"cookies" :[]},
  {"classes": 
    [{"Department" : "CS1101", 
      "Professor" : "bob",
      "Room" : "AK116"
     },
    { "Department" : "ME1800",
      "Professor" : "Jill",
      "Room" : "SL115"
    },
    { "Department"  : "CS2303",
      "Professor" : "Andres",
      "Room" : "OH107"
    },
    { "Department" : "PSY1401",
      "Professor" : "Brian",
      "Room" : "SL315"
    },
    { "Department" : "RBE1001",
      "Professor" : "Megan",
      "Room" : "Flupper"
    },
    { "Department" : "ECE2049",
      "Professor" : "Sam",
      "Room" : "Flower"
    },
    { "Department" : "CS4801",
      "Professor" : "Emily",
      "Room" : "AK232"
    }]
  }).write()


app.use(require('body-parser').urlencoded({ extended: true }));
// app.use(bodyParser.json())
app.use(passport.initialize());
app.use(passport.session());
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

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(obj, done) {
  done(null, obj);
});


app.get('/', function(req, res) {
    res.sendFile('public/views/login.html', {root : '.'})
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

app.get('/auth/github', passport.authenticate('github', {scope:['user:email']}),
  function(x,y){});

app.get('/auth/github/callback', passport.authenticate('github', {failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/index');
  });

passport.use(new GitHubStrategy({
    passReqToCallBack: true,
    clientID: 'd601f4e4de6912a5c81c',
    clientSecret: 'ac4b432f842da48758d09836ab55984d561f7b9a',
    callbackURL: "https://jharnois4512-a3-persistence.glitch.me/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      var ent = {}
      ent['name'] = profile.username;
      sendjson["username"] = profile.username;
      db.get('users').push(ent).write()
      console.log(db.get('users').find(ent).value())
      process.nextTick(function(){
        return done(null, profile)
      })
  }));

app.post('/submit', function(request, response) {
  console.log(request.body, "here")
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
       db.get('classes').push(myEnt).write()
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
      console.log(db.get('classes').find(catObj).assign(secObj).value())
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
       console.log(db.get('classes').find(catObj).value());
       db.get('classes').remove(catObj).write()
     }
       response.writeHead( 200, "OK", {'Content-Type': 'application/json', 'charset':'UTF-8'});
       sendjson["classes"] = db.get('classes').value()
       response.end(JSON.stringify(sendjson));
    })
});

app.listen(port || 3000)

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.redirect('/login')
}