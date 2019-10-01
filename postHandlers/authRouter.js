import CONSTANTS from "../public/js/constants";

const session = require('express-session');
const Local = require('passport-local').Strategy;
const DbAccessor = require('../dbScripts/dbAccessor').DbAccessor;
const ListCredentials = require('../dbScripts/ListCredentials').ListCredentials;

//initialize the dao so it can be set by the server
let dao = new DbAccessor('', '', '');

//somehow this isn't getting set up properly
exports.setDao = function (daoToSet) {
    dao = daoToSet;
};

exports.initPassport = function (app, passport) {

    const localStrategy = function (username, password, done) {
        console.log('username is ' + username + 'password is ' + password);
        let found = dao.getAllLists().filter(e =>
            e.listName === username
        );
        if (found.length < 1) {
            console.log('couldnt find username');
            return done(null, false, {message: 'invalid username or password'})
        }
        if (password === found.peek().listPassword) {
            console.log('log in succeeded');
            return done(null, {username, password})
        }
        console.log('log in failed due to password');
        return done(null, false, {message: 'invalid username or password'})
    };

    app.use(session({secret: 'cats cats cats', resave: false, saveUninitialized: false}));
    app.use(passport.initialize());
    app.use(passport.session());

    passport.use(new Local(localStrategy));

    // We attach the user id to the cookie for the session
    passport.serializeUser((user, done) => done(null, user.username));

    // "name" below refers to whatever piece of info is serialized in seralizeUser,
    // in this example we're using the username
    passport.deserializeUser((username, done) => {
        const user = username;

        if (user !== undefined) {
            done(null, user)
        } else {
            done(null, false, {message: 'user not found; session not restored'})
        }
    });
    //this creates the user
    app.post(
        CONSTANTS.CREATE_LIST,
        function (req, res) {
            let listName = req.body.username;
            let password = req.body.password;
            let cred = new ListCredentials(listName, password);
            let added = dao.addListCredential(cred);
            let body = {added: added};
            res.end(JSON.stringify(body));
        }
    );

    //this defines what we send to the user on a successful authentication
    app.post(
        CONSTANTS.LOGIN,
        passport.authenticate('local'),
        function (req, res) {
            console.log('user:', req.user);
            res.json({status: true})
        }
    );

    app.post('/test', function (req, res) {
        console.log('authenticate with cookie?', req.user);
        res.json({status: 'success'})
    });
};