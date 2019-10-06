/*
Created by Elie Hess.

If you're seeing this, do me a favor and watch this video before proceeding with whatever else you were doing.

https://www.youtube.com/watch?v=CQ85sUNBK7w
*/
const low = require('lowdb'),
    express = require('express'),
    compression = require('compression'),
    session = require('express-session'),
    passport = require('passport'),
    Local = require('passport-local').Strategy,
    //FileSync = require('lowdb/adapters/FileSync'),
    mime = require("mime"),
    helmet = require("helmet"),
    bodyParser = require('body-parser'),
    responseTime = require('response-time'),
    morgan = require('morgan'),
    mongodb = require('mongodb'),
    //adapter = new FileSync('db.json'),
    //db = low(adapter),
    app = express(),
    dir = "public/",
    port = 3000;

app.use(express.static('public'));
app.use(helmet());
app.use(compression());
app.use(bodyParser.json());
app.use(responseTime());
app.use(morgan('tiny'));
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Bad thing happened');
});

const MongoClient = mongodb.MongoClient;
const uri = "mongodb+srv://admin:admin@a5-eliehess-98hnm.mongodb.net/admin?retryWrites=true&w=majority";
const client = new MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
let users = null

client.connect()
    .then(() => {
        return client.db('MTG').createCollection('users')
    })
    .then(__collection => {
        // store reference to collection
        users = __collection
        // blank query returns all documents
        return users.find({}).toArray()
    })
    .then(console.log)

passport.use(new Local(function (username, password, done) {
    users.findOne({username: username}).then((response) => {
        console.log("r: " + response)
        console.log(response.password)
        console.log(response.username)
        if (!response) {
            console.log("user not found")
            return done(null, false, {
                message: "user not found"
            });
        } else if (response.password === password) {
            console.log("user found")
            return done(null, {
                username,
                password
            })
        } else {
            console.log("incorrect password")
            return done(null, false, {
                message: "incorrect password"
            });
        }
    })
}));

passport.initialize();

passport.serializeUser((user, done) => done(null, user.username))

passport.deserializeUser((username, done) => {
    users.findOne({
        username: username
    }).then((user) => {
        if (user !== undefined) {
            done(null, user)
        } else {
            done(null, false, {
                message: 'user not found; session not restored'
            })
        }
    })
});

app.use(session({
    secret: 'fifteen potatoes',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.post('/login', passport.authenticate('local'), function (req, res) {
    console.log('user: ', req.user)
    res.json({
        status: true
    })
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

/*app.get('/getdata', function (req, res) {
    const type = mime.getType(db.get('members').value());
    res.writeHeader(200, {
        "Content-Type": type
    });
    res.write(JSON.stringify({
        data: db.get('members').value()
    }));
    res.flush();
    res.end();
});*/

app.get('/getdata', (req, res) => {
    if (users !== null) {
        users.find({}).toArray().then(result => {
            /*res.writeHeader(200, {
                "Content-Type": type
            });*/
            res.write(JSON.stringify({
                data: result
            }));
            console.log("get: " + result)
            /*res.flush();
            res.end();*/
        })
    }
})

app.post('/update', function (req, res) {
    const updatedEntry = {
        "firstname": req.body.firstname,
        "lastname": req.body.lastname,
        "username": req.body.username,
        "password": req.body.password,
        _id: makeid(req.body.username)
    };

    /*db.get('members').remove({
        username: updatedEntry.username
    }).write();

    db.get('members').push(updatedEntry).write();*/

    users.deleteOne({_id: mongodb.ObjectID(updatedEntry._id)})
    users.insertOne(updatedEntry).then(() => {
        res.writeHead(200, "OK", {
            "Content-Type": "text/plain"
        });
        res.end();
    })
});

app.post('/submit', function (req, res) {
    const newMember = {
        "firstname": req.body.firstname,
        "lastname": req.body.lastname,
        "username": req.body.username,
        "password": req.body.password,
        _id: makeid(req.body.username)
    };

    //db.get('members').push(newMember).write();
    users.insertOne(newMember).then(() => {
        res.writeHead(200, "OK", {
            "Content-Type": "text/plain"
        });
        res.end();
    })
})

app.post('/delete', function (req, res) {
    /*db.get('members').remove({
        username: req.body.username
    }).write();
    res.writeHead(200, "OK", {
        "Content-Type": "text/plain"
    });
    res.end();*/
    users.deleteOne({_id: mongodb.ObjectID(req.body._id)})
        .then(result => res.json(result))
});

app.listen(process.env.PORT || port, function () {
    console.log("Server running on port " + port);
    console.log("Press Ctrl + C to stop");
});

const makeid = function (str) {
    let fin = 0
    str.split('').forEach(function (c) {
        fin += c.charCodeAt(0)
    });
    return fin
}
