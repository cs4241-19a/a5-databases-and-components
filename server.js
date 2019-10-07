const express = require('express'),
    passport = require('passport'),
    mongodb = require('mongodb'),
    bodyParser = require('body-parser'),
    sessions = require('express-session'),
    LocalStrategy = require('passport-local').Strategy,
    flash = require('connect-flash'),
    favicon = require('express-favicon');

const app = express();
let User = [];

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://nkalish:mcirsh1220@cluster0-71ivp.mongodb.net/admin?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
let collection = null;

client.connect()
    .then( () => {
        // will only create collection if it doesn't exist
        return client.db( 'test' ).createCollection( 'todos' )
    })
    .then( __collection => {
        // store reference to collection
        collection = __collection;
        // blank query returns all documents
        collection.find({id: 'users'}).toArray(function(err, result) {
            if (err) throw err;
            User = JSON.parse(result[1].users);
        });
        return collection.find({ }).toArray()
    })
    .then(console.log);

app.use( (req,res,next) => {
    if( collection !== null ) {
        next()
    }else{
        res.status( 503 ).send()
    }
});

app.use(express.static('public'));
app.use(favicon(__dirname + '/public/favicon.png'));
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
    let user = req.session.passport.user;
    let doc;
    collection.find({id: user}).toArray(function (err, result) {
        if (err) throw err;
        doc = result[0];
        if (!doc) {
            doc = {
              id: req.session.passport.user,
              palletList: []
            };
            collection.insertOne(doc);
            res.send([]);
        } else {
            res.send(doc.palletList);
        }
    });
});

app.post('/submitPallet', function (req, res) {
   const body = req.body;
   let palletList = [];
   let doc;
   collection.find({id: req.session.passport.user}).toArray(function (err, result) {
       if (err) throw err;
       doc = result[0];
       palletList = JSON.parse(doc.palletList);
       const pallet = palletList.find(pallet => pallet.palletName === body.palletName);
       if (!pallet) {
           palletList.push(body);
           collection.updateOne( {_id:mongodb.ObjectID( doc._id ) }, { $set:{ palletList:JSON.stringify(palletList) } })
       } else {
           palletList.forEach((entry, index) => {
               if (entry.palletName === body.palletName) {
                   palletList[index] = body;
               }
               collection.updateOne( {_id:mongodb.ObjectID( doc._id ) }, { $set:{ palletList:JSON.stringify(palletList) } });
           });
       }
       res.send(JSON.stringify(palletList));
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
        let users;
        collection.updateOne({_id:mongodb.ObjectID( '5d9a4d717d6a623dccfffed5' )}, { $set:{ users: JSON.stringify(User) } }).then(result => {
            console.log(result);
        });
    }
    res.sendFile(__dirname + '/public/html/login.html');
});

app.post('/getPallet', function (req, res) {
   let data = req.body;
   let session = req.session;
   let doc;
   console.log(data);
   collection.find({id: req.session.passport.user}).toArray(function (err, result) {
       if (err) throw err;
       doc = result[0];
       console.log(doc);
       res.send(JSON.parse(doc.palletList).find(pallet => pallet.palletName === data.palletName));
   });
});

app.post('/deletePallet', function (req, res) {
   let data = req.body;
   let doc;
   let palletList;
   collection.find({id: req.session.passport.user}).toArray(function (err, result) {
       if (err) throw err;
       doc = result[0];
       console.log('this is data', data);
       palletList = JSON.parse(doc.palletList);
       let newList = palletList.filter(function(value, index, arr){
           return value.palletName !== data.palletName;
       });
       doc.palletList = [];
       newList.forEach(entry => {
           doc.palletList.push(entry.palletName);
       });
       res.send(doc.palletList);
       collection.updateOne( {_id:mongodb.ObjectID( doc._id ) }, { $set:{ palletList:doc.palletList } });
   });
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
