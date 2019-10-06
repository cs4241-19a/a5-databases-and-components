const express = require('express');
const app = express();
const db = require('./dbManager.mongodb');
const passport = require("passport");
const Strategy = require('passport-local').Strategy;

// const isProduction = process.env.NODE_ENV === 'production';

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(require('morgan')('combined'));
app.use(require('body-parser').urlencoded({extended: true}));
app.use(require('body-parser').json());
app.use(require('express-session')({secret: 'r2xyZ6bqBgmufbS', resave: false, saveUninitialized: false}));
const favicon = require('serve-favicon');
const path = require('path');
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));


passport.use(new Strategy(
    function (username, password, cb) {
        db.checkPass(username, password).then((user) => {
            return cb(null, user);
        }).catch(error => {
                return cb(error)
            }
        );
    }
));

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, cb) {
    cb(null, user.username);
});

passport.deserializeUser(function (username, cb) {
    db.getUser(username).then((user, error) => {
        if (error) return cb(error);
        cb(null, user);
    });
});

// http://expressjs.com/en/starter/basic-routing.html
// app.get('/', function(request, response) {
//   response.sendFile(__dirname + '/views/index.ejs');
// });

app.get('/',
    function (req, res) {
        db.getAllContent().then(content =>
            res.render('index', {user: req.user, content: content, readonly: true}))
    });

app.get('/login',
    function (req, res) {
        res.render('login', {message: ""});
    });

app.post('/login',
    passport.authenticate('local', {failureRedirect: '/login'}),
    function (req, res) {
        res.redirect('profile');
    });

app.get('/signup',
    function (req, res) {
        res.render('signup', {message: "", username: "", displayName: "", password: ""});
    });

app.post('/signup',
    function (req, res) {
        db.CreateUser(req.body.username, req.body.displayName, req.body.password)
            .then(message => res.render('login', {message: message}))
            .catch(message => res.render('signup', {
                message: message,
                username: req.body.username,
                displayName: req.body.displayName,
                password: req.body.password
            }))
    });

app.post('/submit',
    require('connect-ensure-login').ensureLoggedIn(),
    function (req, res) {
        console.log("Body: ", req.body);
        db.addOrUpdateContent(req.user, req.body.contentType, req.body.contentInput, req.body.contentID);
        res.redirect('profile');
    });

app.post('/delete',
    require('connect-ensure-login').ensureLoggedIn(),
    function (req, res) {
        db.deleteContent(req.user, req.body.contentID);
        res.redirect('profile');
    });

app.get('/logout',
    function (req, res) {
        req.logout();
        res.redirect('/');
    });

app.get('/profile',
    require('connect-ensure-login').ensureLoggedIn(),
    function (req, res) {
        db.getContentForUser(req.user).then(content => {
            console.log("Got content: ", content);
            res.render('profile', {user: req.user, content: content, readonly: false})
        })
    });

// db.getUser('evan').then(user => {
//         console.log("Got user for evan: ", user);
//         if (user === null)
//     }
// );
// db.CreateUser('evan', 'Evan Goldstein', 'pass');
app.listen(3000);
