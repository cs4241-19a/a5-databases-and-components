// init project
const express = require('express');
const low = require('lowdb')
const app = express();
const mongodb = require( 'mongodb' ).MongoClient;
var Local = require('passport-local').Strategy;
var passport = require('passport');
const bodyParser = require ('body-parser');
const session = require('express-session');
let currentSession = ["", ""]
let userData = []
const admin = {user:"admin", pass:"admin"}
let kt = JSON.stringify(admin)
let entry = {'user': 'admin', 'bookName': 'In Cold Blood', 'authorName': 'Truman Capote', 'comments': 'This is one of my favorite books! Its a mystery but also a real story', 'rating': '4', 'status': 'good' }
var FileSync = require('lowdb/adapters/FileSync')
var timeout = require('connect-timeout')
const userAdapter = new FileSync('users.json')
const dataAdapter = new FileSync('db.json')
const userdb = low(userAdapter)
const db = low(dataAdapter)
let credentials = ''
const helmet = require('helmet')
let currentUserName = ''

const uri = "mongodb+srv://krthompson:" + process.env.MONGOPASS + "@ktrose1webware-l30wz.mongodb.net/admin?retryWrites=true&w=majority";
let collection = null


app.use(timeout('5s'))
app.use(session({secret: 'parrots are birds', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(helmet())
app.use(express.static('public'));
//////////////////////////////////////////

function haltOnTimedout (req, res, next) {
  if (!req.timedout) next()
}

//Passport set up////////////////////////
passport.serializeUser((user, done) => {
  done(null, user.username)
})

passport.deserializeUser((username, done) => {
  const user = userdb.find({ username: username }).value()
  credentials = username
  if(user != undefined){
    done(null, user)
  } else {
    done(null, false, {message: 'User could not be found'})
  }
})


// default users///////////////////////////
userdb.defaults({ users: [
      {"username":"admin", "password":"admin"}
    ]
  }).write();

// default data
db.defaults({ data: [
      {"user":"","bookName":"","authorName":"","comments":"","rating":"","status":""}
    ]
  }).write();

//////////////////////////////////////////
// GET FUNCTIONS

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/public/index.html');
});

app.get('/home', function(request, response) {
  response.sendFile(__dirname + '/public/home.html');
});

app.get('/account', function(request, response) {
  response.sendFile(__dirname + '/public/account.html');
});

app.get('/badlogin', function(request, response) {
  response.sendFile(__dirname + '/public/index.html');
});

app.get('/books', function(request, response) {
  mongodb.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, client) {
       if(err) {
            console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
       }
       console.log('Connected...');
       client.db("webwarea5").collection("data").find({user: currentUserName}).toArray(function(err, result){
           response.send(JSON.stringify(result))
       })
    
       client.close();
       console.log('loaded data');
      });
});

app.get('/signout', function(req, response){
  req.session.destroy()
  currentUserName = ''
  credentials = ''
  response.sendFile(__dirname + '/public/index.html');
});

//////////////////////////////////////////
//add a book to app data
const bookAddition = function (data) {
  const new_book = data
  new_book.user = currentUserName
  
  mongodb.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, client) {
    if(err) {
      console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
    }
    console.log('Connected...');
    client.db("webwarea5").collection("data").insertOne(new_book);
    client.close();
    console.log('inserted data!');
  });
}

//add a new account to user data
const accountAddition = function (data) {
  const new_account = data
  
  mongodb.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, client) {
    if(err) {
      console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
    }
    console.log('Connected...');
    client.db("webwarea5").collection("users").insertOne(new_account);
    client.close();
    console.log('inserted data!');
  });
}

//delete a book given its name
const bookDeletion = function (data) {
  const name = data
  
  mongodb.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, client) {
       if(err) {
            console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
       }
        console.log('Connected...');
        client.db("webwarea5").collection("data").deleteOne({bookName: name})
        client.close();
        console.log('deleted data!');
      });
}

// Update rating of a book -> this then will update the status
const bookEdition = function (data) {
  const name = data.bookName
  const newRating = data.rating
  
  mongodb.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, client) {
       if(err) {
            console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
       }
        console.log('Connected...');
        client.db("webwarea5").collection("data").updateOne({bookName: name}, { $set: {rating: newRating}})
        client.close();
        console.log('updated data!');
      });
}

//////////////////////////////////////////
//POST FUNCTIONS

app.post('/addBook', timeout('5s'),haltOnTimedout, function (req, res) {
  let dataString = ''
  req.on( 'data', function( data ) {
      dataString += data 
  })
  req.on( 'end', function() {
    let body = JSON.parse( dataString )
    const addData = JSON.parse( dataString )
    bookAddition(addData)
  })
})

app.post('/createAccount', timeout('5s'),haltOnTimedout, function (req, res) {
  let dataString = ''
  req.on( 'data', function( data ) {
      dataString += data 
  })
  req.on( 'end', function() {
    let body = JSON.parse( dataString )
    const addData = JSON.parse( dataString )
    accountAddition(addData)
  })
})

app.post('/delBook', timeout('5s'),haltOnTimedout, function (req, res) {
  let dataString = ''
  req.on( 'data', function( data ) {
      dataString += data 
  })
  req.on( 'end', function() {
    const delData = dataString
    bookDeletion(delData)
  })
})

app.post('/editBook', timeout('5s'),haltOnTimedout, function (req, res) {
  let dataString = ''
  req.on( 'data', function( data ) {
      dataString += data 
  })
  req.on( 'end', function() {
    let body = JSON.parse( dataString )
    const editData = JSON.parse( dataString )
    bookEdition(editData)
  })
})

//////////////////////////////////////////
//more passport local stuff

const myLocalStrategy = function(username, password, done) {
  mongodb.connect(uri, { useUnifiedTopology: true, useNewUrlParser: true }, function(err, client) {
       if(err) {
            console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
       }
       console.log('Connected...');
       client.db("webwarea5").collection("users").find({username: username}).toArray(function(err, result){
         let user = result
         let realUser = user[0]
         console.log(realUser)
         if (realUser === undefined) {
          console.log('no such user')
          return done(null, false, {message: 'no such user'})
        } else if (realUser.password === password){
          console.log('correct user identification')
          currentUserName = realUser.username
          return done(null, {username, password})
        } else {
          console.log('incorrect password')
          return done (null, false, {message: 'wrong password'})
        }
         
       })
        client.close();
        console.log('got one!');
      });
}

passport.use(new Local(myLocalStrategy))

app.post('/login', timeout('5s'),haltOnTimedout, passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/badlogin'
}),
    function (req, res) {
        res.json({ status: true })
    }
  )

//////////////////////////////////////////
// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
