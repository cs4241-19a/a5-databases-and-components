/**
 * CS4241 - a3 
 * Express server
 * 
 * Author: Rui Huang
 */

// PACKAGES
const express = require('express'),
    session = require('express-session'),
    passport = require('passport'),
    Local = require('passport-local').Strategy,
    morgan = require('morgan'),
    mongodb = require('mongodb'),
    dotenv = require('dotenv').config(),
    bodyParser = require('body-parser'),
    favicon = require('serve-favicon'),
    cookieParser = require('cookie-parser');

const app = express();
const uri = 'mongodb+srv://' + process.env.USER + ':' + process.env.PASS + '@' + process.env.HOST + '/' + process.env.DB
const client = new mongodb.MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })

app.use(express.static('public'));
app.use(bodyParser.json());
app.use(morgan('tiny'));
app.use(cookieParser());
app.use(favicon(__dirname + '/public/img/favicon.png'));
app.use((req, res, next) => {
    if (collection !== null) {
        next()
    } else {
        res.status(503).send()
    }
});

// MongoDB 
let collection = null
client.connect()
    .then(() => {
        // will only create collection if it doesn't exist
        return client.db('a5').createCollection('users')
    })
    .then(__collection => {
        // store reference to collection
        collection = __collection
        // blank query returns all documents
        return collection.find({}).toArray()
    })
    .then(console.log)


// PASSPORT
const myLocalStrategy = async function (username, password, done) {
    // users = user_db.value()
    // const user = users.find(__user => __user.username === username)
    const user = await collection.findOne({ username: username });
    
    if (user === undefined) {
        console.log('user not found')
        return done(null, false, { message: 'user not found' })
    } else if (user.password === password) {
        console.log('correct')
        return done(null, { username, password })
    } else {
        console.log('incorrect password')
        return done(null, false, { message: 'incorrect password' })
    }
}

passport.use(new Local(myLocalStrategy))
passport.initialize()

passport.serializeUser((user, done) => done(null, user.username))

passport.deserializeUser(async (username, done) => {
    const user = await collection.findOne({ username: username });
    console.log('deserializing:', user.username)

    if (user !== undefined) {
        done(null, user)
    } else {
        done(null, false, { message: 'user not found; session not restored' })
    }
})

app.use(session({ secret: 'cats cats cats', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())

app.get('/test', function (req, res) {
    console.log('authenticate with cookie?', req.user)
    res.json({ test: 'json' })
    console.log(collection.find({ username: 'iris' }).toArray().then(console.log))
})

// SERVER LOGICS
app.get('/', function (req, res) {
    console.log(req.user)
    res.sendFile(__dirname + '/public/index.html');
});

app.post(
    '/login',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login.html'
    }),
    function (req, res) {
        console.log("Login successful")
        console.log(req.user)
        res.json({ status: true })
    }
)

app.post('/register', function (req, res) {
    let data = req.body

    collection.findOne({username: data.username}).then(user => {
        if (user != undefined){
            res.sendStatus(409)
        } else{
            data.people = []
            collection.insert(data)
            res.sendStatus(200)
        }
    })
    // if (user_db.find({ 'username': data.username }).value() != undefined) {
    //     res.sendStatus(409)
    // } else {
    //     user_db.push(data).write()
    //     db.push({
    //         "user": data.username,
    //         "people": []
    //     }).write()
    //     res.sendStatus(200)
    // }
})

app.get('/people', function (req, res) {
    if (req.user === undefined) {
        res.redirect(401, '/login.html')
    }
    else {
        let user = req.user.username
        res.set('Content-Type', 'application/json');
        collection.findOne({ username: user }).then(user => {
            res.send(user.people)
        });
        // res.send(db.find({ 'user': user }).get('people').value());
    }
})

app.post('/person', function (req, res) {
    if (req.user === undefined) {
        res.redirect(401, '/login.html')
    }
    else {
        let user = req.user.username
        let data = req.body
        data.age = _calculateAge(data.birthday);
        console.log(data)
        collection.update(
            { username: user },
            { $push: { people: data } }
        )
        // db.find({ 'user': user }).get('people').push(data).write();
        res.sendStatus(200);
    }
})

app.post('/person/:id', function (req, res) {
    if (req.user === undefined) {
        res.redirect(401, '/login.html')
    }
    else {
        let user = req.user.username
        let data = req.body
        console.log(data)
        data.age = _calculateAge(data.birthday);
        let key = 'people.' + req.params.id
        collection.updateOne(
            { username: user },
            { $set: { [key]: data } }
        )
        // db.find({ 'user': user }).get('people').nth(req.params.id).assign(data).write()
        res.sendStatus(200);
    }
})

app.delete('/person/:id', function (req, res) {
    if (req.user === undefined) {
        res.redirect(401, '/login.html')
    }
    else {
        let user = req.user.username

        collection.findOne({username: user}).then(user => {
            user.people.splice(req.params.id, 1)
            collection.save(user)
        })

        // db.find({ 'user': user }).get('people').pullAt(req.params.id).write()
        res.sendStatus(200)
    }
})

// HELPER FUNCTIONS
const _calculateAge = function (birthday_str) { // birthday is a date
    var birthday = new Date(birthday_str)
    var ageDifMs = Date.now() - birthday.getTime();
    var ageDate = new Date(ageDifMs); // miliseconds from epoch
    return Math.abs(ageDate.getUTCFullYear() - 1970);
}

// LISTENING PORT
app.listen(process.env.PORT || 3000, function () {
    console.log('The app is listening on port ' + this.address().port);
    console.log('Served at http://localhost:3000');
    console.log('Ctrl-c to quit');
})