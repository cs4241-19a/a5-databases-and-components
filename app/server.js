//const express = require('express');
const express = require( 'express' ),
      mongodb = require( 'mongodb' ),
      app = express()

app.use( express.static('public') )
app.use( express.json() )
const compression = require('compression');
//const app = express();
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');
const db = low(adapter);
const bodyParser = require('body-parser');
app.use(express.static('public'));
app.use(bodyParser.json());
const passport = require('passport');
const Local = require('passport-local').Strategy;
const session = require('express-session');
const responseTime = require('response-time');
app.use(responseTime());
//could be short or tiny (or default)
const morgan = require('morgan')
app.use(morgan('short'))
const cookieParser = require('cookie-parser')
app.use(cookieParser())
app.listen(3000);

//Dataset of players/users particpating for checking login and displaying info later
db.defaults({ userlist: [] }).write();
let userlist;
const makeUserList = function() {
    userlist = [];
    let x = 0;
    while (true) {
        let row = db.get(`userlist[${x}]`).value();
        if (row) userlist.push(row)
        else break
        x++;
    }
};
makeUserList();
// Code from lecture for passport
let thisUser = {};
let printThis = "";
const myLocalStrategy = function(username, password, done) {
    const user = userlist.find(__user => __user.username === username);
    if (user === undefined) return done(null, false, { message: 'user not found' });
    else if (user.password === password) return done(null, { username, password });
    else return done(null, false, { message: 'incorrect password' });
};
passport.use(new Local(myLocalStrategy))
passport.initialize()
//code from class
passport.serializeUser((user, done) => done(null, user.username))
passport.deserializeUser((username, done) => {
    const user = userlist.find(u => u.username === username)
    if (user !== undefined) {
        done(null, user)
    } else {
        done(null, false, { message: 'user not found; session not restored' })
    }
})
//code taken from class
app.use(session({ secret: 'cats cats cats', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.post('/test', function(req, res) {
    console.log('authenticate with cookie?', req.user)
    res.json({ status: 'success' })
})

app.post('/login',
    passport.authenticate('local'),
    function (request, response) { response.json({status: true})
    });

app.get('/getthisUser', function(request, response) {
    response.send(thisUser)
});
//default
app.get('/', function(request, response) {
    response.sendFile(__dirname + '/index.html');
});


const uri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+'/'+process.env.DB

const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collection = null

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'test' ).createCollection( 'todos' )
  })
  .then( __collection => {
    // store reference to collection
    collection = __collection
    // blank query returns all documents
    return collection.find({ }).toArray()
  })
  .then( console.log )
  
// route to get all docs
app.get( '/', (req,res) => {
  if( collection !== null ) {
    // get array and pass to res.json
    collection.find({ }).toArray().then( result => res.json( result ) )
  }
})

app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})
  
app.post( '/add', (req,res) => {
  // assumes only one object to insert
  collection.insertOne( req.body ).then( result => res.json( result ) )
})

/////////////////////////////////////////////////////////////////////////////
let userData = null;
//let orderData = null;

client.connect()
  .then(()=>{
    return client.db('Soccer').createCollection('players');
  })
  .then(__collection => {
    userData = __collection;
    return userData.find({}).toArray();
  })
  .then(console.log);

app.use( compression() );
app.use( session({ secret:'cats cats cats', resave: false, saveUninitialized: false }) );
app.use( passport.initialize() );
app.use( passport.session() );

//////////// PASSPORT CONFIGURATION ////////////
passport.use(new Local (
    function(username, password, done) {
      thisUser = {username: username};
      console.log("The username of the user is:" + thisUser.username);
      userData.findOne({
        username: username
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'User does not exist.'});
        }

        if (user.password !== password) {
          return done(null, false, { message: 'Incorrect password.' });
        } else {
          return done(null, user);
        }
      })
    }
));

passport.serializeUser( ( user, done ) => done( null, user.username ) );

passport.deserializeUser( ( username, done ) => {
  userData.findOne({
    username: username
  }).then(user => {
    if( user !== undefined ) {
      done( null, user )
    }else{
      done( null, false, { message:'user not found; session not restored' })
    }
  });
});

app.post('/createAccount', function (request, response) {
  userData.findOne({
    username: request.body.username
  }).then(result => {
    if (result === null) {
      userData.insertOne({
        username: request.body.username,
        password: request.body.password,
        name: request.body.name,//name.value,
        age: request.body.age,//parseInt(age.value),
        gender: request.body.gender,//gender,
        goals: request.body.goals,//parseInt(goals.value),
        shots: request.body.shots//parseInt(shots.value)
      });
      response.send(JSON.stringify({status: true}))
    } else {
      response.send(JSON.stringify({status: false}))
    }
  })
});




app.post('/update', function (request, response) {
    const playerToUpdate = request.body;

    userData.updateOne(
      { "username": thisUser.username},
      { $set:{
        name: playerToUpdate.name,
        age: parseInt(playerToUpdate.age),
        gender: playerToUpdate.gender,
        shots: parseInt(playerToUpdate.shots),
        goals: parseInt(playerToUpdate.goals),
      }}
    ).then(result => console.log(thisUser.username));//orderToUpdate.index));

    response.writeHead( 200, "OK", {'Content-Type': 'application/json' });
    response.end();
});


app.post('/delete', function (request, response) {

    console.log(request.body);

    userData.deleteOne({
      "username":thisUser.username
    }).then(result => console.log("deleted"));

    response.writeHead( 200, "OK", {'Content-Type': 'application/json' });
    response.end();
});




//calls to display data with the home page
app.get('/loadTable', function(request, response) {
  userData.find({ }, {_id: 0}).toArray().then( result => response.json( result ) )  
});

