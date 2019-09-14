"use strict";

// init project
const express = require('express'),
      app       = express(),
      session   = require( 'express-session' ),
      passport  = require( 'passport' ),
      Local     = require( 'passport-local' ).Strategy,
      bodyParser= require( 'body-parser' ),
      low       = require('lowdb'),
      FileSync  = require('lowdb/adapters/FileSync'),
      adapter   = new FileSync('.data/db.json'),
      db        = low(adapter),
      bcrypt = require('bcryptjs'),
      shortid = require('shortid'),
      rateLimit = require("express-rate-limit")

const salt = bcrypt.genSaltSync(10);

db.defaults({ comments: [], users: [] })
  .write()

app.use((req, res, next) => {
  if (req.headers['x-forwarded-proto'].split(',')[0] !== 'https')
      // the statement for performing our redirection
      res.redirect('https://' + req.headers.host + req.url)
  else
      return next();
});

app.use( express.static('./public') )
app.use( bodyParser.json());
app.use( session({ secret:process.env.SESSION_SECRET, resave:false, saveUninitialized:false }));
app.use( passport.initialize())
app.use( passport.session())

const isNotLoggedIn = function(req, res, next) {
  if (undefined === req.user) {
    next()
  } else {
    res.redirect('/home')
  }
}

const isLoggedIn = function(req, res, next) {
  if (undefined === req.user) {
    res.redirect('/')
  } else {
    next()
  }
}

// Modified rom lecture notes
// all authentication requests in passwords assume that your client
// is submitting a field named "username" and field named "password".
// these are both passed as arugments to the authentication strategy.
const myLocalStrategy = function( username, password, done ) {
  const users = db.get('users')
  
  // find the first item in our users array where the username
  // matches what was sent by the client. nicer to read/write than a for loop!
  const user = users.value().find( __user => __user.username === username )
  
  // if user is undefined, then there was no match for the submitted username
  if( user === undefined ) {
    /* arguments to done():
     - an error object (usually returned from database requests )
     - authentication status
     - a message / other data to send to client
    */
    return done( null, false, { message:'Incorrect username or password!' })
  }else if( bcrypt.compareSync(password, user.password) ) {
    // we found the user and the password matches!
    // go ahead and send the userdata... this will appear as request.user
    // in all express middleware functions.
    return done( null, { username, password })
  }else{
    // we found the user but the password didn't match...
    return done( null, false, { message: 'Incorrect username or password' })
  }
}

passport.use( new Local( myLocalStrategy ) )


passport.serializeUser( ( user, done ) => done( null, user.username ) )

// "name" below refers to whatever piece of info is serialized in seralizeUser,
// in this example we're using the username
passport.deserializeUser( ( username, done ) => {
  const user = db.get('users').value().find( u => u.username === username )
  
  if( user !== undefined ) {
    done( null, user )
  }else{
    done( null, false, { message:'user not found; session not restored' })
  }
})


app.use(function(req, res, next) {
  if (req.url.length > 42) {
    req.award_code = 414
    res.status(414).end()
  }
  next()
})


const addAward = function(username, code) {
  const user = db.get('users').find({username: username}).value()

  if (!user.awards.includes(code)) {
    user.awards.push(code)
    db.get('users')
    .find({ username: username })
    .assign({ awards: user.awards})
    .write()
  }
}

app.post( 
  '/login',
  passport.authenticate( 'local' ),
  function( req, res ) {
    if (undefined === req.user) {
      res.json({status: req.message})
    } else {
      res.json({status: 200})
    }
  }
)


app.post(
  '/signup',
  isNotLoggedIn,
  function( req, res ) {
    const requested_username = req.body.username
    const requested_password = req.body.password
    const users = db.get('users').value()
    
    if (undefined === users.find( __user => __user.username === requested_username )) {
      const hash = bcrypt.hashSync(requested_password, salt);
      const new_user = {
        "username": requested_username,
        "password": hash,
        "display_name": requested_username,
        "awards": []
      }
      
      db.get('users').push(new_user).write()
      
      res.json({ status:'success' })
    } else {
      res.json({ status:'failed' })
    }
  }
)

app.post('/add_comment', isLoggedIn, function (req, res, next) {
  const username = req.user.username

  const new_comment = {id: shortid.generate(),
                       message: req.body.message,
                       timestamp: (new Date()).getTime(),
                       username: username }
  db.get('comments').push(new_comment).write()
  
  req.award_code = 201
  next()
})


app.post('/remove_comment', isLoggedIn, function (req, res, next) {
  const username = req.user.username
  const comment_id = req.body.message_id
  
  const comment = db.get('comments').value().find( __comment => __comment.id === comment_id )

  if (undefined === comment) {
    // TODO: update
  
  res.status(200)
  } else if (comment.username !== username) {
    req.award_code = 403
  } else {
    db.get('comments').remove(comment).write()
    req.award_code = 200
  }
  
  next()
})


app.get('/comments', isLoggedIn, function (req, res) {
  res.json({username: req.user.username, messages: db.get('comments').sortBy('timestamp').value().reverse()})
})

app.get('/users', isLoggedIn, function (req, res) {
  res.json(db.get('users').value())
})

// http://expressjs.com/en/starter/basic-routing.html
app.get('/', isNotLoggedIn, function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});



const rateLimitHandler = function(req, res, next) {
  addAward(req.user.username, 429)
  res.status(429).sendFile(__dirname + '/views/errors/429.html')
}

const limiter = rateLimit({
  windowMs: 5*1000,
  max: 5,
  handler: rateLimitHandler
});
app.use('/home', isLoggedIn)
app.use('/home', limiter)
app.get('/home', function(request, response) {
  response.status(200)
  addAward(request.user.username, 200)
  response.sendFile(__dirname + '/views/home.html')
})

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

app.get('/expo/:x/:f', isLoggedIn, function(req, res, next) {
  const x = req.params.x
  const f = req.params.f

  try {
    res.json({result: Number.parseFloat(x).toExponential(f)})
    req.award_code = 200
  } catch (error) {
    req.award_code = 500
    next()
  }
})

app.get('/brewCoffee', function(req, res, next) {
  req.award_code = 418
  next()
})

app.get('/area51', function(req, res, next) {
  req.award_code = 451
  next()
})

app.get('/me', isLoggedIn, function(req, res, next) {
  req.award_code = 200
  res.json(req.user)
})

app.delete('/*', function(req, res, next) {
  req.award_code = 405
  next()
})

app.all('/*', function(req, res, next) {
  if (undefined === req.award_code) {
    req.award_code = 404
  }
  next()
})

app.use(function(req, res, next) {
  if (undefined !== req.user) {
    addAward(req.user.username, req.award_code)
  }
  
  res.status(req.award_code)
  if(404 === req.award_code) {
    res.sendFile(__dirname + '/views/errors/404.html')
  } else if (418 === req.award_code) {
    res.sendFile(__dirname + '/views/errors/418.html')
  } else if (451 === req.award_code) {
    res.sendFile(__dirname + '/views/errors/451.html')
  } else if (500 === req.award_code) {
    res.sendFile(__dirname + '/views/errors/500.html')
  } else if (414 === req.award_code) {
    res.sendFile(__dirname + '/views/errors/414.html')
  } else if (429 === req.award_code) {
    res.sendFile(__dirname + '/views/errors/429.html')
  } else if (405 === req.award_code) {
    res.sendFile(__dirname + '/views/errors/405.html')
  } else {
    res.end()
  }
})

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});
