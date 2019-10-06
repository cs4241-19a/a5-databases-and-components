/**
 * Author: Zonglin Peng
 */
// - - - - - - MACROS - - - - - - 
const dir  = '/public/';
const port = 3000;
let dataAll;
let auth = {}; //my user name
let collection = null
// - - - - - - REQUIRES - - - - - - 

//Server
var bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')
var express = require('express')
var timeout = require('connect-timeout')
var mongodb = require( 'mongodb' )
var app = express()
app.use(timeout('5s'))
app.use(bodyParser())
app.use(haltOnTimedout)
app.use(cookieParser())
app.use(haltOnTimedout)
//Timeout
function haltOnTimedout (req, res, next) {
  if (!req.timedout) next()
}

app.use( express.static('public') )
app.use( express.json() )
//Passport
const passport = require('passport');
const Local = require('passport-local').Strategy;
const session = require('express-session');
//Favicon
const favicon = require('serve-favicon');
var path = require('path')
app.use(favicon(path.join(__dirname, 'public' , 'images', 'icon.png'))); 
//Cookie
app.use(cookieParser());
//Morgan
const morgan = require('morgan');
app.use(morgan('combined')); // Simple app that will log all request in the Apache combined format to STDOUT
//Static
app.use(express.static('public'))
app.use(bodyParser.json())
//ResponseTime
const StatsD = require('node-statsd')
const responseTime = require('response-time')
const stats = new StatsD()
stats.socket.on('error', function (error) {
  console.error(error.stack)
})
app.use(responseTime(function (req, res, time) {
  var stat = (req.method + req.url).toLowerCase()
    .replace(/[:.]/g, '')
    .replace(/\//g, '_')
  stats.timing(stat, time)
}))


// - - - - - - PASSPORT - - - - - - 
const myLocalStrategy = function( username, password, done ) {
  getAllData()
  user = dataAll.find( __user => __user.username === username )
  // user =  db.get('posts').find( __user => __user.username === username )
  if( user === undefined ) {
    console.log('user not found')
    return done( null, false, { message:'user not found' })
  }else if( user.password === password ) {
    console.log('login success')
    auth = user
    console.log(auth)
    return done( null, { username, password })
  }else{
    console.log('incorrect password : ' + user.username + " & " + user.password)
    return done( null, false, { message: 'incorrect password' })
  }
}

passport.use( new Local( myLocalStrategy ) )
passport.initialize()

passport.serializeUser( ( user, done ) => done( null, user.username ) )
passport.deserializeUser( ( username, done ) => {
  getAllData()
  const user = dataAll.find( u => u.username === username )
  if( user !== undefined ) {
    done( null, user )
  }else{
    done( null, false, { message:'user not found; session not restored' })
  }
})

app.use( session({ secret:'cats cats cats', resave:false, saveUninitialized:false }) )
app.use( passport.initialize() )
app.use( passport.session() )

//Passport: POST
app.post('/test', function( req, res ) {
  console.log( 'authenticate with cookie?', req.user )
  res.json({ status:'success' })
})

app.post( 
  '/login',
  passport.authenticate( 'local' ),
  function( req, res ) {
    console.log( 'user: ', req.user )
    // auth = dataAll.find(__user => __user.username === req.user.username)
    // console.log( 'auth: ', auth.username )
    res.json({ status: true })
  }
)

// - - - - - - DB INITIATE - - - - - - 
//MongoDB
const uri = 'mongodb+srv://admin:1233@webware-test-tm4vb.mongodb.net/admin?retryWrites=true&w=majority'

const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'zonglin-a5' ).createCollection( 'cars' )
  })
  .then( __collection => {
    // store reference to collection
    collection = __collection
    // blank query returns all documents
    return collection.find({ }).toArray()
  })
  .then( data => {
    dataAll = data
    console.log(dataAll )
  })

app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

const getAllData = function() {
  if( collection !== null ) {
    collection.find({}).toArray().then( result => {
      dataAll = result
    })
  }
  console.log(dataAll)
}

// - - - - - - REGISTER PAGE - - - - - - 
// POST
app.post('/register', (request, response) => {
  console.log("BODY: " + JSON.stringify(request.body))
  console.log('Cookies: ', request.cookies)
  getAllData()
  let check = dataAll.find( __user => __user.username === request.body.username )
  if(check === undefined){
    collection.insertOne(request.body).then(result => {
      // response.json(result)
    })
    // getAllData();
    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' });
    response.end();
  }else{
    response.writeHead( 405, "Duplicate User", {'Content-Type': 'text/plain' });
    response.end();
  }
});

// - - - - - - TABLE PAGE - - - - - - 
// GET
app.get('/', (request, response) => {
  response.sendFile(__dirname + dir + '/index.html');
});

app.get('/getAll', (request, response) => {
  getAllData()
  console.log('get getall: ' + dataAll);
  response.send(dataAll);
});

// POST
app.post('/add', (request, response) => {
  console.log("BODY: " + JSON.stringify(request.body))
  console.log('Cookies: ', request.cookies)
  request.body['username'] = auth.username
  request.body['password'] = auth.password
  let weight = ( request.body.year*1 === 0 ||  request.body.mpg*1 === 0) ? 0 : 1;
  request.body.value = ( request.body.mpg*1000 - (2019- request.body.year)*100) *  weight;
  // assumes only one object to insert
  collection.insertOne( request.body )
  // .then( result => response.json( result ) )
  // getAllData();
  response.writeHead( 200, "OK", {'Content-Type': 'text/plain' });
  response.end();
});

app.post('/modify', (request, response) => {
  console.log("BODY: " + JSON.stringify(request.body))
  console.log('Cookies: ', request.cookies)
  let weight = ( request.body.year*1 === 0 ||  request.body.mpg*1 === 0) ? 0 : 1;
  request.body.value = ( request.body.mpg*1000 - (2019- request.body.year)*100) *  weight;
  collection
  .updateOne({ id: request.body.id }, {
      $set: {
        id: request.body.id,
        model: request.body.model,
        year: request.body.year,
        mpg: request.body.mpg,
        value: request.body.value
      }
  })
  // .then(result => {
  //     response.json(result)
  // })
  // getAllData();
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end();
});

app.post('/delete', (request, response) => {
  console.log("BODY: " + JSON.stringify(request.body))
  console.log('Cookies: ', request.cookies)
  collection
    // .deleteOne({ _id:mongodb.ObjectID( auth._id ) })
    // .then( result => response.json( result ) )
    .remove(
      {
        username: auth.username
      }
    )
  // getAllData()
  response.writeHead(200, { 'Content-Type': 'application/json' });
  response.end();
});


// - - - - - - SERVER START - - - - - - 
app.listen(process.env.PORT || port, () => console.log('Car app listening on port 3000!'));
