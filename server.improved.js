const express = require( 'express' ),
      app = express(),
      passport = require( 'passport' ),
      LocalStrategy = require( 'passport-local' ).Strategy,
      bodyParser = require( 'body-parser' ),
      favicon = require('serve-favicon'),
      path = require('path'),
      timeout = require('connect-timeout'),
      helmet = require('helmet'),
      port = 1234;

app.use( express.static(__dirname + '/public' ) );
app.use( bodyParser.json() );
app.use(favicon(path.join(__dirname, '/public', 'panda.jpg')));
app.use(helmet());

app.post('/save', timeout('5s'), bodyParser.json(), haltOnTimedout, function (req, res, next) {
  savePost(req.body, function (err, id) {
    if (err) return next(err)
    if (req.timedout) return
    res.send('saved as id ' + id)
  })
})

function haltOnTimedout (req, res, next) {
  if (!req.timedout) next()
}

function savePost (post, cb) {
  setTimeout(function () {
    cb(null, ((Math.random() * 40000) >>> 0))
  }, (Math.random() * 7000) >>> 0)
}


var admin = require('firebase-admin');
var serviceAccount = require("./serviceKey3.json")

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://a5-webware.firebaseio.com'
});

app.get('/', function (request, response) {
  response.sendFile(__dirname + '/public/items.html');
});

app.get('/receive', function (request, response) {
  ref.on("value", function(snapshot) {
    console.log(snapshot.val());
    response.end(JSON.stringify(snapshot.val()))
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });
});

var db = admin.database();
var ref = db.ref("/");
var usersRef = ref.child("users");

require('firebase/app');
require("firebase/firestore");

passport.use('local', new LocalStrategy( {
  usernameField: 'name',
  passwordField: 'Board'
}, function( name, Board, done ) {

  let myData = {};

  ref.on("value", function (snapshot) {
    myData = snapshot.val();
    console.log("Successful Read from Database");
  }, function (errorObject) {
    console.log("The read failed: " + errorObject.code);
  });

  setTimeout(function() {
    const user = myData.users[name];

    if( user === undefined || user ===  null ) {
      console.log("user not found");
      return done( null, false, { message:'user not found' })
    } else {
      const pass = myData.users[name][Board];
      if ( pass !==  null && pass !== undefined) {
        console.log("successfully authenticated");
        return done(null, {name, Board})
      } else {
        console.log("incorrect password");
        return done( null, false, { message: 'incorrect password' })
      }
    }
  }, 1000);


}));

app.use(passport.initialize());
//app.use(passport.session());

passport.serializeUser(function(name, done) {
  done(null, name);
});

passport.deserializeUser(function(name, done) {
  done(null, name);
});

app.post( '/login', passport.authenticate( 'local' ), function( req, res ) {
  console.log( 'user:', req.body.name );
  res.json({'status': true});
});


app.post( '/submit', function( request, response ) {

  json = request.body;

  if(Object.keys(json).length === 4) {
    var username = JSON.stringify(json.name).replace(/^"(.*)"$/, '$1');
    var email = username + "@tasktracker.com"
    var emailKey = "email"

    json2 = {
      "1": {
        "listname": "list1",
        "taskNums": 1,
        "tasks": {
          "1": {
            "taskName": "Add a task",
            "taskDesc": "Add a new task or edit this one",
            "taskDue": "The Time and Date by which task is due"
          }
        }
      }
    };

    json[emailKey] = email

    writeUserData(json.name, json.Board, json.name, json.fullname, json.email, json.Color, json.Board, json2)
  } else if(Object.keys(json).length === 3) {
    writeUserData2(json.name, json.Board, json.listNameEdit)
  } else if(Object.keys(json).length === 6) {
    writeUserData3(json.name, json.Board, json.taskName, json.taskDes, json.dueDate, json.taskNum)
  }else if(Object.keys(json).length === 7) {
    writeUserData4(json.name, json.Board, json.taskNum, json.taskName, json.taskDes, json.dueDate)
  }else if(Object.keys(json).length === 5) {
    writeUserData5(json.name, json.Board, json.taskNum)
  }

  response.writeHead( 200, { 'Content-Type': 'application/json'})
  response.end( JSON.stringify( request.body ) )
})

function writeUserData(ref, refBoard, username, fullname, email, color, boardName, lists) {
  var usernameRef = usersRef.child(ref);
  var boardRef = usernameRef.child(refBoard);
  boardRef.set({
    username: username,
    fullname: fullname,
    email: email,
    color: color,
    boardName: boardName,
    lists: lists
  });
}

function writeUserData2(ref, refBoard, listName) {
  var usernameRef = usersRef.child(ref);
  var boardRef = usernameRef.child(refBoard);
  var listsRef = boardRef.child("lists/1");
  listsRef.update({
    listname: listName
  });
}

function writeUserData3(ref, refBoard, taskName, taskDesc, taskDue, taskNum) {
  var usernameRef = usersRef.child(ref);
  var boardRef = usernameRef.child(refBoard);
  var listsRef = boardRef.child("lists/1");
  listsRef.update({
    taskNums: parseInt(taskNum)
  });
  var tasksRef = listsRef.child("tasks");
  var taskRef = tasksRef.child(taskNum)
  taskRef.set({
    taskName: taskName,
    taskDesc: taskDesc,
    taskDue: taskDue
  });
}

function writeUserData4(ref, refBoard, taskNum, taskName, taskDesc, taskDue) {
  var usernameRef = usersRef.child(ref);
  var boardRef = usernameRef.child(refBoard);
  var listsRef = boardRef.child("lists/1");
  var tasksRef = listsRef.child("tasks");
  var taskRef = tasksRef.child(taskNum);
  taskRef.update({
    taskName: taskName,
    taskDesc: taskDesc,
    taskDue: taskDue
  });
}

function writeUserData5(ref, refBoard, taskNum) {
  var usernameRef = usersRef.child(ref);
  var boardRef = usernameRef.child(refBoard);
  var listsRef = boardRef.child("lists/1");
  var tasksRef = listsRef.child("tasks");
  var taskRef = tasksRef.child(taskNum);
  taskRef.remove().then(function() {
    console.log("Remove succeeded.")
  })
      .catch(function(error) {
        console.log("Remove failed: " + error.message)
      });
}

app.listen( process.env.PORT || port )
