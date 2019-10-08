const express = require('express'),
    app = express(),
    session = require('express-session'),
    passport = require('passport'),
    Local = require('passport-local').Strategy,
    bodyParser = require('body-parser'),
    low = require('lowdb'),
    fs = require('lowdb/adapters/FileSync'),
    adapter = new fs('db.json'),
    db = low(adapter);

app.use(express.static('./'))
app.use(bodyParser.json())


db.defaults({ users:[] }).write();



// all authentication requests in passwords assume that your client
// is submitting a field named "username" and field named "password".
// these are both passed as arugments to the authentication strategy.
const myLocalStrategy = function (username, password, done) {
    //Using lowbd to find a user
    const user = db.get('users').filter(user => user.name === username).value();

    // if user is undefined, then there was no match for the submitted username
    if (user.length === 0) {
       //Add a new user to the database! 
        db.get('users').push({name: username, password: password, capsules: ""}).write();
        val = 'new user created';
        entry = null;
        return done(null, {username, password, val, entry});
    } else if (user[0].password === password) {
        // we found the user and the password matches!
        // go ahead and send the userdata... this will appear as request.user
        // in all express middleware functions.
        val = 'correct login';
        entry = user[0].capsules;
        return done(null, { username, password, val, entry})
    } else {
        // we found the user but the password didn't match...
        return done(null, false, { message: 'incorrect password' })
    }
}
app.use(session({ secret: 'cats cats cats', resave: false, saveUninitialized: false }));
passport.use(new Local(myLocalStrategy));
app.use(passport.initialize());
app.use(passport.session());



app.post(
    '/login',
    passport.authenticate('local'),
    function (req, res) {
        res.json({status: req.user.val, words: req.user.entry});
    }
)

//Store the user info in the cookie
passport.serializeUser((user, done ) => done(null, user.username));


passport.deserializeUser((username, done) => {
    const user = db.get('users').filter(user => user.name === username).value();
    console.log('deserializing:', user[0].name); 

    if (user !== undefined) {
        done(null, user[0].name)
    } else {
        done(null, false, { message: 'user not found; session not restored' })
    }
})

app.listen(process.env.PORT || 3001)
