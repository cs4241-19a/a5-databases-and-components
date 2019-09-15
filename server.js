const express = require('express'),
    pouchdb = require('pouchdb'),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    sessions = require('express-session'),
    LocalStrategy = require('passport-local').Strategy,
    flash = require('connect-flash');

pouchdb.plugin(require('pouchdb-upsert'));

const db = new pouchdb('my_db');
const app = express();
let User = [];

db.get('users').catch(function (err) {
    if (err.name === 'not_found') {
        return {
            _id: 'users',
            users: []
        };
    } else { // hm, some other error
        throw err;
    }
}).then(function (doc) {
   User = doc.users;
}).catch(err => {
    console.log(err);
});

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(sessions({secret: '{secret}', name: 'session_id', saveUninitialized: true, resave: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.get('/', function(request, response) {
    response.sendFile(__dirname + '/public/html/login.html');
});

app.get('/index', function (request, response) {
   response.sendFile(__dirname + '/public/html/index.html');
});

app.post('/palletList', function (req, res) {
    req.session.palletList = [];
    db.get(req.session.passport.user).catch(err => {
        console.log(err);
    }).then(doc => {
        let palletList;
        if (doc.palletList) {
            palletList = doc.palletList;
        } else {
            palletList = [];
        }
        palletList.forEach(entry => {
            req.session.palletList.push(entry.palletName);
        });
        res.status(200).send(req.session.palletList);
    }).catch(err => {
        console.log(err);
    });
});

app.post('/submitPallet', function (req, res) {
   const body = req.body;
   const session = req.session;
   let palletList = [];
   db.get(session.passport.user).catch(err => {
       console.log(err);
   }).then(doc => {
       palletList = doc.palletList || [];
       if (session.palletList) {
           const pallet = session.palletList.find(pallet => pallet === body.palletName);
           if (!pallet) {
               palletList.push(body);
               session.palletList.push(body.palletName);
               db.upsert(session.passport.user, function(doc) {
                   doc.counter = doc.counter || 0;
                   doc.counter++;
                   doc.palletList = palletList;
                   return doc;
               }).catch(err => {
                   console.log(err);
               })
           } else {
               palletList.forEach((entry, index) => {
                   if (entry.palletName === body.palletName) {
                       palletList[index] = body;
                   }});
               db.upsert(session.passport.user, function(doc) {
                   doc.counter = doc.counter || 0;
                   doc.counter++;
                   doc.palletList = palletList;
                   return doc;
               }).catch(err => {
                   console.log(err);
               })
           }
       }
       res.status(200).send(req.session.palletList);
   }).catch(err => {
       console.log(err);
   });
});

app.post('/createUser', function (req, res) {
    let newUser = req.body;
    const user1 = User.find(user => user.username === newUser.newUsername);
    if (!user1) {
        newUser = {
            username: newUser.newUsername,
            password: newUser.newPassword,
        };
        User.push(newUser);
        let userDoc = {
            _id: 'users',
            users: User
        };
        db.upsert('users', function (doc) {
            doc.counter = doc.counter || 0;
            doc.counter++;
            doc.users = User;
            return doc;
        }).catch(err => {
            console.log(err);
        });
    }
    res.sendFile(__dirname + '/public/html/login.html');
});

app.post('/getPallet', function (req, res) {
   let data = req.body;
   let session = req.session;
   db.get(session.passport.user).then(doc => {
      let pallet = doc.palletList.find(pallet => pallet.palletName === data.palletName);
      if(pallet) {
          res.status(200).send(pallet);
      }
   }).catch(err => {
       console.log(err);
   });
});

app.post('/deletePallet', function (req, res) {
   let session = req.session;
   let data = req.body;

   db.get(session.passport.user).then(doc => {
       let newList = doc.palletList.filter(function(value, index, arr){
           return value.palletName !== data.palletName;
       });
       session.palletList = [];
       newList.forEach(entry => {
           session.palletList.push(entry.palletName);
       });
       db.upsert(session.passport.user, function(doc) {
           doc.counter = doc.counter || 0;
           doc.counter++;
           doc.palletList = newList;
           return doc;
       }).catch(err => {
           console.log(err);
       });
       res.status(200).send(session.palletList);
   }).catch(err => {
       console.log(err);
   })
});

app.post('/login',
    passport.authenticate('local', { successRedirect: '/index',
        failureRedirect: '/', failureFlash: 'Invalid Username of Password' }));

const listener = app.listen(3000, function() {
    console.log('Your app is listening on port ' + 3000);
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        const user1 = User.find(user => user.username === username);

        if (!user1) {
            return done(null, false, {message: "Incorrect user"});
        } else if (user1.password === password) {
            return done(null, {username, password});
        } else {
            return done(null, false, {message: "Incorrect password"});
        }
    }
));

passport.serializeUser( ( user, done ) => done( null, user.username ) );

passport.deserializeUser( ( username, done ) => {
    const user = User.find( u => u.username === username );
    console.log( 'deserializing:', username );

    if( user !== undefined ) {
        done( null, user )
    }else{
        done( null, false, { message:'user not found; session not restored' })
    }
});
