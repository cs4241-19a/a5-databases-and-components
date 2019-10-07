require('dotenv').config();
require('fs');
require('http');
require('mime');
const
    bodyparser = require('body-parser'),
    express = require('express'),
    favicon = require('serve-favicon'),
    FileSync = require('lowdb/adapters/FileSync'),
    low = require('lowdb'),
    passport = require('passport'),
    path = require('path'),
    querystring = require('querystring'),
    request = require('request'),
    session = require('express-session'),
    SpotifyStrategy = require('passport-spotify').Strategy,
    adapter = new FileSync('db.json'),
    app = express(),
    db = low(adapter),
    port = 3000,
    client_id = process.env.client_id,
    client_secret = process.env.client_secret,
    redirect_uri = process.env.spotify_callback;

passport.use(
    new SpotifyStrategy({
          clientID: client_id,
          clientSecret: client_secret,
          callbackURL: redirect_uri,
        },
        function(accessToken, refreshToken, expires_in, profile, done) {
          let stored = db.get('users').find({
            id: profile.id,
          });

          if (stored.value()) {
            stored.assign({
              token: accessToken,
            }).write();
          } else {
            db.get('users').push({
              id: profile.id,
              name: profile.display_name,
              token: accessToken,
            }).write();
          }
          process.nextTick(() => done(null, profile));
        },
    ),
);

passport.serializeUser(function(user, done) {
  done(null, {
    id: user.id,
    name: user.name,
  });
});

passport.deserializeUser(function(user, done) {
  let user_ = db.get('users').find({
    id: user.id,
  }).value();
  if (user_) {
    done(null, user_);
  } else {
    done(null, false);
  }
});

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
  extended: true,
}));
app.use(express.static('public'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.png')));
app.use(session({
  secret: 'spotify',
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/login', passport.authenticate('spotify'), function(req, res) {
  // The request will be redirected to spotify for authentication, so this
  // function will not be called.
});

app.get('/search', (req, res) => {
  if (!req.user) {
    req.user = {
      token: 'invalid',
    };
  }
  let options = {
    url: `https://api.spotify.com/v1/search?${querystring.stringify(
        req.query)}&type=track`,
    headers: {
      Authorization: `Bearer ${req.user.token}`,
    },
    json: true,
  };
  console.log(options.url);
  request.get(options, (err, response, body) => {
    if (err) {
      console.log(err);
    }
    res.json(body);
  });

});

app.post('/add', (req, res) => {
  request.get({
    url: `https://api.spotify.com/v1/tracks/${req.body.id}`,
    headers: {
      Authorization: `Bearer ${req.user.token}`,
    },
    json: true,
  }, (err, response, body) => {
    if (err) {
      console.log(err);
    }
    let song = body;
    console.log(db.get('songs').find({
      id: song.id.trim(),
    }).value() != null);
    if (db.get('songs').find({
      id: song.id.trim(),
    }).value() != null) {
      res.status(200).send({
        message: 'The song is already in the queue',
      });
    } else {
      let queue = db.get('songs').value();
      db.get('songs').push({
        id: song.id.trim(),
        title: song.name.trim(),
        artist: song.artists[0].name.trim(),
        album: song.album.name.trim(),
        adder: req.user.id.trim(),
        duration: parseInt(song.duration_ms),
        startTime: queue[queue.length - 1] ?
            queue[queue.length - 1].startTime +
            queue[queue.length - 1].duration :
            new Date().getTime(),
      }).write();
      res.status(200).send({
        message: `Added ${song.name} to queue`,
      });
    }
  });
});

app.get('/queue', (req, res) => {
  let songs = db.get('songs').cloneDeep().value();
  songs.forEach((song) => {
    if (req.user && song.adder === req.user.id) {
      song.ownedByUser = true;
    }
  });
  res.json(songs);

});

app.post('/delete', (req, res) => {
  if (!req.user) {
    res.status(403).send({
      message: 'You are not logged in',
    });
    return;
  }
  if (!db.get('songs').has({
    id: req.body.id,
  })) {
    res.status(404).send({
      message: 'Song not in queue',
    });
    return;
  }
  let song = db.get('songs').find({
    id: req.body.id,
  }).value();
  if (song.adder === req.user.id) {
    // remove songs
    db.get('songs').remove({
      id: req.body.id,
      adder: req.user.id,
    }).write();
    res.status(200).send({
      message: 'Removed song from queue',
    });
    return;
  }
  res.status(403).send({
    message: 'Unauthorized access',
  });
});

app.get('/callback', passport.authenticate('spotify', {
      failureRedirect: '/login',
    }),
    function(req, res) {
      res.redirect('/');
    },
);

app.listen(process.env.PORT || port,
    () => console.log(`Listening on port ${port}`));
