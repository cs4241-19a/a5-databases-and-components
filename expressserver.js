const express   = require( 'express' ),
      app       = express(),
      session   = require( 'express-session' ),
      passport  = require( 'passport' ),
      Local     = require( 'passport-local' ).Strategy,
      bodyParser= require( 'body-parser' ),
      helmet = require('helmet')
      favicon = require('serve-favicon')
      path = require('path')
      optimus = require('connect-image-optimus')

// automatically deliver all files in the public folder
// with the correct headers / MIME type.
app.use( express.static( 'public' ) )

// get json when appropriate - middleware
app.use( bodyParser.json() )

// connect-image-optimus - middleware
var staticPath = __dirname + '/static/'
app.use(optimus(staticPath))

// favicon - middleware
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

// helmet - middleware
app.use(helmet())

// domain views index.html
app.get('/', function(request, response) {
  response.sendFile( __dirname + '/views/index.html' )
  response.send('hello, world!')
})

app.use( session({ secret:'cats cats cats', resave:false, saveUninitialized:false }) )
app.use( passport.initialize() )
app.use( passport.session() )

app.post('/test', function( req, res ) {
  console.log( 'authenticate with cookie?', req.user )
  res.json({ status:'success' })
})


// AUTHENTICATION
const myLocalStrategy = function( username, password, done ) {

  const user = db.get('users').find({username: username}).value()
  
  // if user is undefined, then there was no match for the submitted username
  if( user === undefined ) { 
    return done( null, false, { message:'user not found' })
  }else if( user.password === password ) {
    return done( null, { username, password })
  }else{
    return done( null, false, { message: 'incorrect password' })
  }
}

// passport - middleware
passport.use( new Local( myLocalStrategy ) )
passport.initialize()

app.post( 
  '/login',
  passport.authenticate( 'local', { successRedirect: '/admin.html', failureRedirect: '/login.html'}),
  function( req, res ) {
    res.json({ status:true })
  }
)

passport.serializeUser( ( user, done ) => {
  console.log( 'serializing:', user.username)
  done( null, user.username ) 
})

passport.deserializeUser( ( username, done ) => {
  const user = db.find( u => u.username === username )
  console.log( 'deserializing:', username )
  
  if( user !== undefined ) {
    done( null, user )
  }else{
    done( null, false, { message:'user not found; session not restored' })
  }
})



// ORDERS
// GET orders
app.get('/orders', (req, res) => res.send(db.get('orders').values()))

// POST update
app.post( '/update', function( request, response ) {
  dataString = ''
  
  request.on( 'data', function( data ) {
    dataString += data
  })

  request.on( 'end', function() {

    var updatedata = JSON.parse(dataString)
    var yourname = (updatedata.yourname)
    var phone = (updatedata.phone)
    var potato = (updatedata.potato)
    var seasoning = (updatedata.seasoning)
    var size = (updatedata.size)
    var currentordernum = (updatedata.currentordernum)

    //obj = { yourname: yourname, phone: phone, potato: potato, seasoning: seasoning, size: size, ordernum: currentordernum}

    db.get('orders')
      .find({ordernum: currentordernum})
      .assign({ yourname: yourname, phone: phone, potato: potato, seasoning: seasoning, size: size, ordernum: currentordernum}) 
      .value()

    response.writeHead( 200, "OK", {'Content-Type': 'application/json' })
    response.end()
  })
})

// POST remove
app.post( '/remove', function( request, response ) {
  dataString = ''
  
  request.on( 'data', function( data ) {
    dataString += data
  })

  request.on( 'end', function() {

    var removedata = JSON.parse(dataString)
    var index = (removedata.number)

    db.get('orders')
      .pullAt(index)
      .write()

    response.writeHead( 200, "OK", {'Content-Type': 'application/json' })
    response.end()
  })
})

// POST submit
app.post( '/submit', function( request, response ) {
  dataString = ''

  request.on( 'data', function( data ) {
    dataString += data
  })

  request.on( 'end', function() {

    var order = JSON.parse( dataString )
    var yourname = (order.yourname)
    var phone = (order.phone)
    var potato = (order.potato)
    var seasoning = (order.seasoning)
    var size = (order.size)
    var ordernum = db.get('ordercount')
                     .value()

    obj = { yourname: yourname, phone: phone, potato: potato, seasoning: seasoning, size: size, ordernum: ordernum}
    console.log(obj)

    // add new order to orders part of database
    db.get('orders')
      .push(obj)  
      .write()

    // increment ordercount
    db.update('ordercount', n => n + 1)
      .write()

    response.writeHead( 200, "OK", {'Content-Type': 'application/json' })
    response.end()
  })
})

app.listen( process.env.PORT || 3000 )



// DATABASE
// low db set up
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low( adapter )

// set defaults (required if your JSON file is empty)
db.defaults({ orders: [], users: [], ordercount: 0 })
  .write()

/*
// add an order
db.get('orders')
  .push({ yourname: 'Joe', phone: '122-343-2334', potato: 'sweet', seasoning: 'salt', size: 'small', ordernum: 1234})
  .write() 
*/

/*
// add a user
db.get('users')
  .push({ username:'test', password:'grader' })
  .write()
*/
  
/*
// increment ordercount
db.update('ordercount', n => n + 1)
  .write()
*/

/*
// filter users by age
const seniors = db.get( 'users' )
  .filter( user => user.age > 70 )
  .value()
*/