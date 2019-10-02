const fs   = require( 'fs' ),
      mime = require( 'mime' ),
      express = require('express'),
      session = require('express-session'),
      passport = require('passport'), //Used for OAuth
      bodyParser = require('body-parser'),
      querystring = require('querystring'),
      cookieParser = require('cookie-parser'),
      request = require('request'),
      app = express(),
      port = 3000,
      MongoClient = require('mongodb').MongoClient, //Database MongoDB
      SpotifyStrategy = require('passport-spotify').Strategy, //Spotify Credentials
      client_id = 'da70dd0556874f0189eb6c64543eef72',
      client_secret = 'c11bdf5f5886434aac3b5dbe1f02984b',
      redirect_uri = 'http://localhost:3000/callback',
      dbUser = "the_queue",
      dbPass = "2H7xLeTJUki2bf7V",
      dburl = `mongodb+srv://${dbUser}:${dbPass}@cluster0-jmgry.mongodb.net/test?retryWrites=true&w=majority`,
      dbName = 'Cluster0',
      client = new MongoClient(dburl, { useNewUrlParser: true, useUnifiedTopology:true });

let loggedIn = '',
    client_token = "",
    db = null;

client.connect()
    .then( () => {
        db = client.db(dbName);
        return db;
    });

passport.use(
    new SpotifyStrategy({
        clientID: client_id,
        clientSecret: client_secret,
        callbackURL: redirect_uri
    },
    function(accessToken, refreshToken, expires_in, profile, done) {
                db.collection('users')
                    .insertOne({
                        id: profile.id,
                        displayName: profile.displayName,
                        token: accessToken
                    })
        client_token = accessToken;
        loggedIn = profile.id;
        process.nextTick(function() {
            return done(null, profile);
        });
    })
);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: 'spotify-secret', resave: true, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     if( err === null ) {
       response.writeHeader( 200, { 'Content-Type': type })
       response.end( content )

     }else{
       response.writeHeader( 404 )
       response.end( '404 Error: File Not Found' )
     }
   })
}

//File Handlers
app.get("/", function (request, response) {
    sendFile( response, 'index.html' );
});
  
app.get("/style.css", function (request, response) {
    sendFile( response, 'style.css' );
});

app.get("/queue.html", function (request, response) {
    sendFile( response, 'queue.html' );
});

app.get("/queue.js", function (request, response) {
    sendFile( response, 'queue.js' );
});

app.get("/token", function(req, res){
    res.end(client_token);
})

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, db.collection('users').find({id: user.id}));
});

//Spotify API
app.get('/login-spotify', 
    passport.authenticate('spotify', { successRedirect: redirect_uri, failureRedirect: '/' })
);

app.get('/callback',
  passport.authenticate('spotify', { failureRedirect: '/' }),
  function(req, res) {
    res.redirect('/queue.html');
  }
);

app.get('/user', function(req, res){
    res.end(loggedIn);
})

app.get('/logout', function(req, res) {
    req.session.destroy();
});

app.get('/search', (req, res) => {
    let results = {
        url: `https://api.spotify.com/v1/search?${querystring.stringify(req.query)}&type=track`,
        headers: {
            Authorization: `Bearer ${client_token}`,
        },
        json: true
    }
    request.get(results, (err, response, body) => {
        if (err) {
            console.log(err)
        }
        res.json(body);
    });
})

app.get('/getQueue', function(req, res) {
    db.collection('queue').find().toArray().then(docs => res.end(JSON.stringify(docs)));
});

app.get('/queueLen', function(req, res) {
    let coll = db.collection('queue').stats();
    // coll = coll.find({id: 'count'});
    res.end(JSON.stringify(coll));
})

app.post('/queue', function (req, res) {
    db.collection('queue').insertOne({
        id: req.body.id,
        spotify_uri: req.body.spotify_uri,
        song_name: req.body.song_name,
        artist_name: req.body.artist_name,
        length: req.body.length,
        added_by: req.body.user
    });
    db.collection('queue').find({spotify_uri: req.body.spotify_uri}).toArray()
    .then(docs => res.end(JSON.stringify(docs[0])));
});

app.post('/delete', function (req, res) {
    db.collection('queue').deleteOne({id: req.body.id});
    res.end('Deleted item');
});

app.listen( process.env.PORT || port );