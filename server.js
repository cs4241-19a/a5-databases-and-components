// users: [
//     {
//         username: 'name',
//         password: 'pword',
//         trips: [
//             {
//                 tripname: 'wwr',
//                 dates: 'a - b',
//                 gear: 'y',
//                 paid: 'y',
//             }
//         ]
//     }
// ]

const express        = require('express'),
      app            = express(),
      favicon        = require('serve-favicon'),
      session        = require('express-session'),
      lowercasePaths = require('express-lowercase-paths'),
      passport       = require('passport'),
      Local          = require('passport-local').Strategy,
      bodyParser     = require('body-parser'),
      low            = require('lowdb'),
      FileSync       = require('lowdb/adapters/FileSync'),
      serveStatic    = require('serve-static'),
      fs             = require('fs')


const adapter = new FileSync('db.json');
const db = low(adapter);

app.use(favicon(__dirname + '/src/img/favicon.ico'));
app.use(lowercasePaths());
app.use(serveStatic('dist'));
app.use(bodyParser.json());
db.defaults({ users: [] }).write();

const strat = function(username, password, done) {
    const user = db.get('users').find(__user => __user.username === username).value();

    if (user === undefined) {
        console.log('user not found')

        //add to db and login with new user creds
        db.get('users')
          .push({username: username, password: password, trips: []})
          .write();
        return done(null, {username, password}, {message: 'new user'});
    } else if (user.password === password) {
        return done(null, {username, password}, {message: 'logging in'});
    } else {
        return done(null, false, {message: 'incorrect password'});
    }
}

passport.use(new Local(strat));

passport.serializeUser((user, done) => done(null, user.username));

passport.deserializeUser((username, done) => {
    const user = db.get('users').find(__user => __user.username === username).value();

    if (user !== undefined) {
        done(null, user);
    } else {
        done(null, false, {message: 'user not found, session not restored'});
    }
})

function checkAuth(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/');
    }
}

app.use(session({secret:'secret', resave: false, saveUninitialized: false}))
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/dist/login.html');
})

app.post('/login', passport.authenticate('local'), function(req, res) {
    res.json({status: true})
})


app.get('/main', checkAuth, function (req, res) {
    res.sendFile(__dirname + '/dist/main.html');
})

app.post('/trips', checkAuth, function(req, res) {
    const user = db.get('users').find(__user => __user.username === req.user.username);
    let trips = user.get('trips').value()
    let tripsjson = JSON.stringify(trips);
    res.json(tripsjson)
})

app.post('/signup', checkAuth, function(req, res) {
    const user = db.get('users').find(__user => __user.username === req.user.username);
    const trip = user.get('trips').find({tripname: req.body.tripname})

    //if does not exist, add
    if (trip.value() === undefined) {
        user.get('trips')
            .push({
                tripname: req.body.tripname,
                dates: req.body.dates,
                gear: req.body.gear,
                paid: req.body.paid
            })
            .write();
        res.send({message: "added"})
    } else {
        //if already exists, delete from server
        user.get('trips')
            .remove({tripname: req.body.tripname})
            .write();
        res.send({message: "removed"})
    }
})

app.post('/pay', checkAuth, function(req, res) {
    const user = db.get('users').find(__user => __user.username === req.user.username);
    const trip = user.get('trips').find({tripname: req.body.tripname})

    //do nothing if the trip does not exist, only updates record if trip exists
    if (!(trip.value() === undefined)) {
        user.get('trips')
            .find({tripname: req.body.tripname})
            .assign({paid: req.body.paid})
            .write();
    }
    res.end();
})

app.post('/gear', checkAuth, function(req, res) {
    const user = db.get('users').find(__user => __user.username === req.user.username);
    const trip = user.get('trips').find({tripname: req.body.tripname})

    //do nothing if the trip does not exist, only updates record if trip exists
    if (!(trip.value() === undefined)) {
        user.get('trips')
            .find({tripname: req.body.tripname})
            .assign({gear: req.body.gear})
            .write();
    }
    res.end();
})

app.get('/resultsData', checkAuth, function(req, res) {
    const user = db.get('users').find(__user => __user.username === req.user.username).value();
    // fs.writeFile((__dirname + '/src/html/results.html'), JSON.stringify(user, undefined, 2), function(err) {
    //     if(err) return console.log(err);
    //     console.log("File saved");
    // })
    res.json(user);
})

app.get('/results', checkAuth, function(req, res) {
    console.log(__dirname + '/src/html/results.html')
    res.sendFile(__dirname + '/src/html/results.html');
})

app.post('/test', function(req, res) {
    console.log('auth w cookie?', req.user);
    res.json({status: 'success'})
})

app.listen(process.env.PORT || 3000)