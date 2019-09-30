const express   = require( 'express' ),
      app       = express(),
      // morgan    = require( 'morgan' ),
      session   = require( 'express-session' ),
      passport  = require( 'passport' ),
      GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
      bodyParser= require( 'body-parser' ),
      favicon   = require( 'serve-favicon' ),
      path      = require( 'path' ),
      helmet = require('helmet'),
      compression = require('compression'),

      // neo4j = require('neo4j-driver').v1,
      // driver = neo4j.driver(uri, neo4j.auth.basic(user, password)),
      // session = driver.session(),

      //killing this for neo4j
      low       = require('lowdb'),
      FileSync  = require('lowdb/adapters/FileSync'),
      adapter   = new FileSync('db.json'),
      db        = low(adapter),
      //killing

      port      = 3000


app.use(helmet())
app.use(compression())
app.use( express.static('public'))
app.use( bodyParser.json())
// app.use( morgan('combined'))
app.use(favicon(path.join('public','res','favicon.ico')))
app.use( session({ secret:'fromage', name:'a3-cookie', resave:false, saveUninitialized:true }) )
app.use( passport.initialize() )
app.use( passport.session() )
passport.use(new GoogleStrategy({
    clientID: '443479129403-kgnq88arlnldecfi9qp87queha2fhl7r.apps.googleusercontent.com',
    clientSecret: 'RIPOr3cA2Vwyd00UiMNoxNfK',
    callbackURL: "https://a3-hcaouette.glitch.me/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
   return done(null, profile);
  }
));
passport.initialize()


const sendFile = function( response, filename ) {
  const type = mime.getType( filename );
  fs.readFile( filename, function( err, content ) {
    if ( err === null ) {
      response.writeHeader( 200, {'Content-Type': type});
      response.end( content );
    } else {
      response.writeHeader( 404 );
      response.end( '404 Error: File Not Found' );
    }
  });
};

//redirects
app.get(('/' || '/index.html'), (req, res) => res.sendFile('public/pages/index.html'))
app.get('/header', (req,res) => res.render('public/pages/header'))
app.get('/cheeses.html', (req, res) => res.sendFile('public/pages/cheeses.html'))
app.get('/about.html', (req, res) => res.sendFile('public/pages/about.html'))
app.get('/cart.html', (req, res) => res.sendFile('public/pages/cart.html'))
app.get('/login.html', (req, res) => res.sendFile('public/pages/login.html'))
app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }))
app.get('/auth/google/callback', passport.authenticate('google',
  { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

function profileParse(profile) {
 if(!profile){
   return {
     id: -1,
     name: "0",
     image: ""
   }
 }
 let imageUrl = '';
 if (profile.photos && profile.photos.length) {
   imageUrl = profile.photos[0].value;
 }
 return {
   id: profile.id,
   name: profile.displayName,
   image: imageUrl
 }
}

app.post('/addToCart', function(req,res){
  let json=req.body,
  chz=json.cheese,
  acct = profileParse(req.user).name;
  console.log(acct)
  console.log('json:')
  console.log(req.body)
  console.log(chz)

  if(db.getState() !== null){
    if(db.get('accounts').find({user:acct})){
      //find user from query in accounts array, update chz type to n++
      db.get('accounts').find({user:acct}).update({chz:n => n + 1})
      console.log(db.get('accounts'))
      let retVal=JSON.stringify('Updated '+acct+' with '+chz)
      console.log("returning this message: ",retVal)
      res.status(200).send({message: retVal})
    }else{
      //no user found; write user and 0 of all chesses, then update correct cheese
      db.get('accounts').push({user:acct, 'ch1':0, 'ch2':0, 'ch3':0, 'ch4':0, 'ch5':0, 'ch6':0, 'ch7':0, 'ch8':0, total:0}).write()
      db.get('accounts').find({user:acct}).update({chz:n => n + 1})
      res.status(200).send({message: 'Made account for ${json.account} with 1 ${json.cheese}'})
    }
  }
  res.status(409).send(/*{message: 'No database existed'}*/)
  // }else{
  //   db.defaults(accounts: [ { user:"", 'ch1':0, 'ch2':0, 'ch3':0, 'ch4':0, 'ch5':0, 'ch6':0, 'ch7':0, 'ch8':0, total:0} ] ).write()
  // }
})


app.get('/loadCart', (req, res) => {
    let acct=profileParse(req.user).name
    let cart = db.get('accounts').find({user:acct}).value()
    console.log(cart)
    res.json(cart)
})

app.get('/loadAcct', (req, res) => {
  let acct=profileParse(req.user).name
  let cheeses = db.get('accounts').find({user:acct}).value()
})

passport.serializeUser( function( user, done ){
  console.log("serializing")
  acct = profileParse(user).name;
  console.log("account is: ",acct)
  db.get('accounts').push({'user':acct, 'ch1':0, 'ch2':0, 'ch3':0, 'ch4':0, 'ch5':0, 'ch6':0, 'ch7':0, 'ch8':0, total:0}).write()
  done( null, user)
})
passport.deserializeUser(function(id, done) {
  console.log("deserializing")
  console.log("deser'd to ",id)
  db.get('accounts').find({user:id})
  done(null,id)
})

app.listen(port, () => console.log(`a3-hcaouette listening on port ${port}!`))
