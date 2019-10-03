const express   = require( 'express' ),
      app       = express(),
      session   = require( 'express-session' ),
      passport  = require( 'passport' ),
      Local     = require( 'passport-local' ).Strategy,
      bodyParser= require( 'body-parser' ),
      low = require('lowdb'),
      FileSync = require('lowdb/adapters/FileSync'),
      adapter = new FileSync('db.json'),
      db = low(adapter),
      AWS = require('aws-sdk'),
      favicon = require('serve-favicon'),
      path = require('path'),
      serveStatic = require('serve-static'),
      compression = require('compression')

// Set the Region 
AWS.config.update({region: 'us-east-2'});

// Create the DynamoDB service object
var ddb = new AWS.DynamoDB({apiVersion: '2012-08-10'});

app.use(serveStatic('public'))
app.use( bodyParser.json() )
app.use( session({ secret:'catsanddogsandfish', resave:false, saveUninitialized:false }) )
app.use( passport.initialize() )
app.use( passport.session() )
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(compression())



// Local DB Config
db.defaults({ users: [
  {"username":"admin", "password":"admin"}
]
}).write();

const getUsers = function(){
  let users = db.get('users').value() // Find all users in the collection
  return users;
}

app.get('/', function( req, res ) {
  if(isLoggedIn(req)){
    res.sendFile('views/index.html', {root: __dirname })
  } else {
    res.sendFile('views/login.html', {root: __dirname })
  }
})
app.get('/new', function( req, res ) {
  if(isLoggedIn(req)){
    res.sendFile('views/new.html', {root: __dirname })
  } else {
    res.sendFile('views/login.html', {root: __dirname })
  }
})
app.get('/about', function( req, res ) {
  if(isLoggedIn(req)){
    res.sendFile('views/about.html', {root: __dirname })
  } else {
    res.sendFile('views/login.html', {root: __dirname })
  }
})
app.get('/edit', function( req, res ) {
  if(isLoggedIn(req)){
    res.sendFile('views/edit.html', {root: __dirname })
  } else {
    res.sendFile('views/login.html', {root: __dirname })
  }
})
app.get("/logout", function (req, res) {
  req.logout()
  res.redirect("/")
})
// server logic will go here
app.listen( process.env.PORT || 3000 )


// all authentication requests in passwords assume that your client
  // is submitting a field named "username" and field named "password".
  // these are both passed as arugments to the authentication strategy.
  const myLocalStrategy = function( username, password, done ) {
    // find the first item in our users array where the username
    // matches what was sent by the client. nicer to read/write than a for loop!
    const user = getUsers().find( __user => __user.username === username )
    
    // if user is undefined, then there was no match for the submitted username
    if( user === undefined ) {
      /* arguments to done():
       - an error object (usually returned from database requests )
       - authentication status
       - a message / other data to send to client
      */
      return done( null, false, { message:'user not found' })
    }else if( user.password === password ) {
      // we found the user and the password matches!
      // go ahead and send the userdata... this will appear as request.user
      // in all express middleware functions.
      return done( null, { username, password })
    }else{
      // we found the user but the password didn't match...
      return done( null, false, { message: 'incorrect password' })
    }
  }

passport.use( new Local( myLocalStrategy ) )
passport.initialize()
  
  app.post( 
    '/login',
    passport.authenticate( 'local' ),
    function( req, res ) {
      console.log( 'user:', req.user )
      res.json({ status:true })
    }
  )

  app.post('/createAccount', function(req, res){
    console.log(req.body)
    let prevUser = db.get('users')
                    .find({ username: req.body.username })
                    .value()

    if(typeof prevUser == 'undefined'){
      db.get('users').push(req.body).write();
      res.writeHeader(200, { 'Content-Type': 'text/plain' })
      res.end()
    } else {
      res.writeHeader(409, { 'Content-Type': 'text/plain' })
      res.end()
    }
  })

passport.serializeUser( ( user, done ) => done( null, user.username ) )

// "name" below refers to whatever piece of info is serialized in seralizeUser,
// in this example we're using the username
passport.deserializeUser( ( username, done ) => {
  const user = getUsers().find( u => u.username === username )
  console.log( 'deserializing:', username )
  
  if( user !== undefined ) {
    done( null, user )
  }else{
    done( null, false, { message:'user not found; session not restored' })
  }
})

app.post('/test', function( req, res ) {
  console.log( 'authenticate with cookie?', isLoggedIn(req) )
  res.json({ status:'success' })
})

app.get('/get', function(request, response){
    if(isLoggedIn(request)){
      getDDB(request.user.username, function(entryString){
          response.writeHeader( 200, { 'Content-Type': 'application/json' })
          response.end( entryString )
        });
    } else {
      response.writeHeader(401, { 'Content-Type': 'text/plain' })
    }
})

app.post('/submit', function(request, response){
    if(!isLoggedIn(request)){
      response.writeHead( 401, "NO", {'Content-Type': 'text/plain' })
      response.end()
      return false;
    }
    let dataString = ''

    request.on( 'data', function( data ) {
        dataString += data 
    })
    request.on( 'end', function() {
      let dataJSON = JSON.parse( dataString )
      console.log( dataJSON )
      // Call DynamoDB to add the item to the table
      let params = {
        TableName: 'todont-list',
        Item: {
          'unixtime' : {N: dataJSON.time},
          'title' : {S: dataJSON.title},
          'notes' : {S: dataJSON.notes},
          'priority' : {N: String(dataJSON.priority)},
          'owner' : {S: request.user.username}
        }
      };
      ddb.putItem(params, function(err, data) {
        if (err) {
          console.log("Error", err);
        } else {
          console.log("Success", data);
        }
      })
      response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
      response.end()
})
})

app.delete('/delete', function(request, response){
    let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })
  request.on( 'end', function() {
    let dataJSON = JSON.parse( dataString )
    console.log( 'on delete' )
    console.log( dataJSON )

    let params = {
      TableName:'todont-list',
      Key:{
          unixtime: {N: dataJSON.time }
        },
      };
    console.log( params )
  ddb.deleteItem(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });

    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
    response.end()
  })
})


var Entry = function(time, title, notes, priority) {
    return {
    'unixtime' : time,
    'title' : title,
    'notes' : notes,
    'priority' : priority
    }
  }

  const isLoggedIn = function(req){
    return (typeof req.user !== 'undefined');
  }
  
  const getDDB = function (user, callback){
    let params = {
      ExpressionAttributeNames: {
        '#owner_table': 'owner',
    },
    ExpressionAttributeValues: {
        ':owner_name': {S: user},
    },
      FilterExpression: '#owner_table = :owner_name',
      TableName: 'todont-list'
    };
    
    ddb.scan(params, function(err, data) {
      let entryArray = []
      if (err) {
        console.log("Error", err);
        return []
      } else {
        data.Items.forEach(function(e, index, array) {
          entryArray.push(new Entry(e.unixtime.N, e.title.S, e.notes.S, e.priority.N))
        });
        entryString = JSON.stringify( entryArray )
        callback(entryString)
      }
    });
  }