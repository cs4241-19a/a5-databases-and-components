const express = require('express'),
    session = require('express-session'),
    favicon = require('serve-favicon'),
    authUtils = require('./authUtils'),
    bodyParser = require('body-parser'),
    uuid = require('uuid'),
    server = express(),
    mongoose = require('mongoose');
passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    dir = '/public/',
    port = 3000;
require('dotenv').config();

mongoose.connect(process.env.MONGO + '/bookmarker', { useNewUrlParser: true });

let links = [
    { 'name': 'Google', 'tags': ['seach engine'], 'url': 'http://google.com', 'icon': 'https://s2.googleusercontent.com/s2/favicons?domain=http://google.com' },
    { 'name': 'Facebook', 'tags': ['social media', 'news'], 'url': 'http://facebook.com', 'icon': 'https://s2.googleusercontent.com/s2/favicons?domain=http://facebook.com' },
    { 'name': 'Feedly', 'tags': ['rss', 'news'], 'url': 'http://feedly.com', 'icon': 'https://s2.googleusercontent.com/s2/favicons?domain=http://feedly.com' },
    { 'name': 'Twitter', 'tags': ['social media', 'news'], 'url': 'http://twitter.com', 'icon': 'https://s2.googleusercontent.com/s2/favicons?domain=http://twitter.com' },
];

var linkSchema = new mongoose.Schema({ name: 'string', tags: 'array', url: 'string', icon: 'string' });
var userSchema = new mongoose.Schema({ username: 'string', id: 'string', password: 'string', links: [linkSchema] });
var User = mongoose.model('User', userSchema);

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {

    console.log('connected to database');

    server.set('port', process.env.PORT || port);

    passport.use(new LocalStrategy(
        function (username, password, done) {
            User.findOne({ username: username }, function (err, user) {
                if (!user) {
                    return done(null, false, { message: 'User not found' });
                }

                var passwordsMatch = authUtils.comparePassword(password, user.password);

                if (!passwordsMatch) {
                    return done(null, false, { message: 'Invalid username & password.' });
                }

                return done(null, user)
            });
        }
    ));

    function isUserAuthenticated(req, res, next) {
        if (req.user) {
            next();
        } else {
            res.send('You must login!');
        }
    }

    function isLoggedOut(req, res, next) {
        if (!req.user) {
            next();
        } else {
            res.send('You are logged in!');
        }
    }

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        User.findOne({ id: id }, function (err, user) {
            if (!user) {
                done({ message: 'Invalid credentials.' }, null);
            } else {
                done(null, user);
            }
        });
    });

    server.use(express.static(__dirname + '/public'));
    server.use(favicon(__dirname + '/public/favicon.ico'));
    server.use(bodyParser.json());
    server.use(bodyParser.urlencoded({ extended: true }));
    server.use(session({ secret: process.env.SECRET }));
    server.use(passport.initialize());
    server.use(passport.session());


    server.get('/', function (req, res) {
        res.sendFile(__dirname + dir + 'index.html');
    });

    server.get('/login', isLoggedOut, (req, res) => {
        res.sendFile(__dirname + dir + 'login.html');
    });

    server.post(
        '/api/login',
        passport.authenticate('local', { failureRedirect: '/login' }),
        function (req, res) {
            res.json({ 'status': true });
        }
    );

    server.get('/signup', (req, res) => {
        res.sendFile(__dirname + dir + 'signup.html');
    });

    server.get('/secret', isUserAuthenticated, (req, res) => {
        res.send('You have reached the secret route');
    });

    server.post('/api/signup', (req, res) => {
        User.findOne({ 'username': req.body.username }, function (err, usr) {
            if (usr) {
                console.log("User exists");
                return res.send(false);
            } else {
                var newUser = new User({ username: req.body.username, id: uuid(), password: authUtils.hashPassword(req.body.password), links: links });

                console.log("Creating new user");

                newUser.save(function (err, user) {
                    if (err) return console.error(err);
                    console.log(user.username + " saved to collection.");
                });
                res.redirect('/');
            }
        });
    });

    server.get('/links', (request, response) => {
        getLinks(request, response);
    });


    server.post('/api/addLink', function (req, res) {
        let link = req.body;
        let duplicate = false;
        console.log(link);

        User.findOne({ 'id': req.user.id }, function (err, user) {
            if (!link.name || !link.url) {
                res.send('empty');
                return;
            }

            let url = link.url;
            let icon = 'https://findicons.com/files/icons/1036/function/48/warning.png';
            if (url) {
                icon = `https://s2.googleusercontent.com/s2/favicons?domain=${url}`;
            }
            link['icon'] = icon;

            if (!/^https?:\/\//i.test(link.url)) {
                link.url = 'http://' + link.url;
            }
            link.name = link.name.charAt(0).toUpperCase() + link.name.slice(1);
            link.tags = link.tags.split(',');

            user.links.filter(l => {
                if ((l.name.toLowerCase() === link.name.toLowerCase() || l.url.toLowerCase() === link.url.toLowerCase()) && !link.isEdit) {
                    res.send('duplicate');
                    duplicate = true;
                }
            });

            if (duplicate) {
                return;
            }

            if (link.isEdit) {
                console.log(`editing ${link.name}`);
                let index = link.isEdit;
                delete link.isEdit; 
                user.links[index] = link;
                user.save();
                res.send(true);
                return;
            }

            if (!duplicate && !link.isEdit) {
                user.links.push(link);
                user.save();
                res.send(true);
            }
        });
    });

    server.post('/api/deleteLink', function (req, res) {
        User.findOne({ 'id': req.user.id }, function (err, user) {
            let index = parseInt(req.body.index);
            user.links.splice(index, 1);
            user.save();
            res.send(true);
        });

    });

    server.get('/links/:tag', function (req, res) {
        console.log("tag is " + req.params.tag);
        getLinks(req, res, req.params.tag);
    });

    server.get('/logout', function (req, res) {
        console.log('Logging out');
        req.logout();
        res.redirect('/');
    });

    server.listen(port, function () {
        console.log(`Bookmarker app listening on port ${port}!`);
    });

    server.use(function (req, res, next) {
        res.status(404).sendFile(__dirname + dir + '404.html');
    });

    const getLinks = (request, response, tag) => {
        console.log('getting Links');
        User.findOne({ 'id': request.user.id }, function (err, user) {
            if(err) {
                console.log('error in getLinks');
                return;
            }
            if (tag) {
                let filteredLinks = user.links.filter(data => {
                    let hasTag = data.tags.filter(t => {
                        return t.trim().toLowerCase() === tag.trim().toLowerCase();
                    });
                    return (hasTag !== undefined && hasTag.length > 0);
                });
                response.json(filteredLinks);
            } else {
                response.json(user.links);
            }
        });
    };
});
