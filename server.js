const express   = require( 'express' ),
      app       = express(),
      session   = require( 'express-session' ),
      passport  = require( 'passport' ),
      Local     = require( 'passport-local' ).Strategy,
      bodyParser= require( 'body-parser' )
      low       = require('lowdb')
      FileSync  = require('lowdb/adapters/FileSync')
app.use( express.static('./') )
app.use( bodyParser.json() )

//need this here or it gives me an error
//passport.initialize()


//for database 
const adapter = new FileSync('db.json')
const db = low(adapter)
var currentUser;

//default data 
/*
 db.defaults({users:[
     {"username": "user1", movies: [{
         "Id": 1, "title": "Mad Max", "genre": "Action", "rating": "5"
     }]}
 ]}).write()
*/

const users = [
    { username:'charlie', password:'charliee' },
    { username:'bill',    password:'billl' }  
  ]



  // all authentication requests in passwords assume that your client
  // is submitting a field named "username" and field named "password".
  // these are both passed as arugments to the authentication strategy.
  const myLocalStrategy = function( username, password, done ) {
    // find the first item in our users array where the username
    // matches what was sent by the client. nicer to read/write than a for loop!
    const user = users.find( __user => __user.username === username )
    
    // if user is undefined, then there was no match for the submitted username
    if( user === undefined ) {
      /* arguments to done():
       - an error object (usually returned from database requests )
       - authentication status
       - a message / other data to send to client
      */
       //console.log(undefined)
       console.log("user not found")
      return done( null, false, { message:'user not found' })
    }else if( user.password === password ) {
      // we found the user and the password matches!
      // go ahead and send the userdata... this will appear as request.user
      // in all express middleware functions
      //console.log(user.secret)
      return done( null, { username, password })
    }else{
      // we found the user but the password didn't match...
      return done( null, false, { message: 'incorrect password' })
    }
  }

  passport.use( new Local( myLocalStrategy ) )
  //app.use(passport.initialize())
  app.use( require('express-session')({ secret:'cats cats cats', resave:false, saveUninitialized:false }));

app.use( passport.initialize() )
app.use( passport.session() )

  app.post( 
    '/home',
    passport.authenticate( 'local',{ failureRedirect: '/'}),
    function( req, res ) {
      console.log( 'user:', req.user )
      currentUser = req.user.username;
      //res.json({ status:true })
      //res.render('/home')
      res.redirect('/home')
    }
  );

  app.get('/home',
  function(req, res){
      res.sendFile(__dirname + '/home.html');
  });

  app.post('/edit',
  function(req, res){
    
    db.get(currentUser)
        .remove({"ID": req.body.ID})
        .write()
    db.get(currentUser)
        .push(req.body)
        .write()
    res.json(db.get(currentUser))
    }
  );

  app.post('/add',
  function(req, res){
      let id = db.get('Count')
      let newEntry = req.body
      newEntry.ID = id
      db.get(currentUser)
      .push(newEntry)
      .write()
    db.update('Count', n=> n+1)
      .write()
    res.json(db.get(currentUser))
  });

  app.post('/delete',
  function(req, res){
      db.get(currentUser) 
        .remove({"ID": req.body.ID})
        .write()
    res.json(db.get(currentUser))
  })

  app.get('/data', 
      function(req,res){
          console.log(db.get(currentUser))
          res.json(db.get(currentUser))
  })
  passport.serializeUser( ( user, done ) => done( null, user.username ) )

  

// "name" below refers to whatever piece of info is serialized in seralizeUser,
// in this example we're using the username
passport.deserializeUser( ( username, done ) => {
  const user = users.find( u => u.username === username )
  console.log( 'deserializing:', user.username )
  
  if( user !== undefined ) {
    done( null, user )
  }else{
    done( null, false, { message:'user not found; session not restored' })
  }
});

//app.use( session({ secret:'cats cats cats', resave:false, saveUninitialized:false }) )


app.post('/test', function( req, res ) {
  console.log( 'authenticate with cookie?', req.user )
  res.json({ status:'success' })
})
/*
app.post('/login', function(req, res){
    console.log('authenticate with cookie?', req.user)
    res.json({status: 'success'})
})
*/

app.listen( process.env.PORT || 3000 )