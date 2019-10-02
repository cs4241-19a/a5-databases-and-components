// init express
const express = require('express');
const favicon = require('serve-favicon')
const app = express();
const port = 3000;

// lowddb
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

//middleware
const bodyParser = require('body-parser')
const shortid = require('shortid')
const session = require('express-session')
const passport = require('passport')
const Local = require('passport-local').Strategy
var responseTime = require('response-time')

// seed db
db.defaults({
  users: [{
    "username": "ben",
    "password": "password"
  }]
}).write();

db.defaults({
    items: [],
  })
  .write()

db.defaults({
  secret: "shopr"
}).write()


let yeezy = {
  'id': shortid.generate(),
  'user': 'ben',
  'name': 'Yeezy 350 Boost',
  'category': 'Fashion',
  'rating': 5,
  'usd': 200,
  'eur': 182,
  'link': "https://stockx.com/adidas-yeezy-boost-350-v2-cream-white?currencyCode=USD&size=8.5&gclid=CjwKCAjwzdLrBRBiEiwAEHrAYr6Goiw3RGnCl12vXPPsgVqOjI-F36X_4AfNaeBDvt6D-mjEkhmVBBoCRBEQAvD_BwE"
};
let mac = {
  'id': shortid.generate(),
  'user': 'ben',
  'name': 'Macbook Pro',
  'category': 'Tech',
  'rating': 3,
  'usd': 1299,
  'eur': 1178.31,
  'link': "https://www.apple.com/shop/buy-mac/macbook-pro/13-inch-space-gray-1.4ghz-quad-core-processor-with-turbo-boost-up-to-3.9ghz-128gb?afid=p238%7Csbepnohbm-dc_mtid_1870765e38482_pcrid_246386726307_pgrid_14874568330_&cid=aos-us-kwgo-pla-mac--slid-----product-MUHN2LL/A"
}
let basketball = {
  'id': shortid.generate(),
  'user': 'ben',
  'name': 'Wilson Basketball',
  'category': 'Sports',
  'rating': 2,
  'usd': 20,
  'eur': 18.14,
  'link': "https://www.wilson.com/en-us/basketball/balls/evolution/evolution-game-basketball?gclid=CjwKCAjwzdLrBRBiEiwAEHrAYsO1rcrobWjAgngQhHvN_RTM9DJZj_zVaqj5c4KJ7Vw5_S4yYuE4QxoCYssQAvD_BwE&source=googleshopping&ef_id=CjwKCAjwzdLrBRBiEiwAEHrAYsO1rcrobWjAgngQhHvN_RTM9DJZj_zVaqj5c4KJ7Vw5_S4yYuE4QxoCYssQAvD_BwE:G:s&s_kwcid=AL!8492!3!179840140943!!!g!430754648574!&CMPID=Google-wilson-basketball_g_shopping_usa---c-179840140943-"
};

let items = db.get('items');

if (items.value().length === 0) {
  items.push(yeezy).write();
  items.push(mac).write();
  items.push(basketball).write();
}

app.use(express.static('public'));
app.use(favicon(__dirname + '/public/favicon.ico'))
app.use(bodyParser.json())
app.use(session({
  secret: db.get("secret").value(),
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize())
app.use(passport.session())
app.use(responseTime())


// all authentication requests in passwords assume that your client
// is submitting a field named "username" and field named "password".
// these are both passed as arugments to the authentication strategy.
const myLocalStrategy = function (username, password, done) {
  // find the first item in our users array where the username
  // matches what was sent by the client. nicer to read/write than a for loop!
  let user = db.get('users')
    .find({
      username: username
    })
    .value()

  // if user is undefined, then there was no match for the submitted username
  if (user === undefined) {
    /* arguments to done():
     - an error object (usually returned from database requests )
     - authentication status
     - a message / other data to send to client
    */
    return done(null, false, {
      message: 'user not found'
    })
  } else if (user.password === password) {
    // we found the user and the password matches!
    // go ahead and send the userdata... this will appear as request.user
    // in all express middleware functions.
    return done(null, {
      username,
      password
    })
  } else {
    // we found the user but the password didn't match...
    return done(null, false, {
      message: 'incorrect password'
    })
  }
}

const mySignupStrategy = function (username, password, done) {
  let isDuplicate = db.get("users").find(__user => __user.username === username);

  if (isDuplicate.value() === undefined) {
    db.get("users").push({
      username: username,
      password: password
    }).write();
    console.log("new user added to db!");

    return done(null, {
      username,
      password
    })

  } else {
    return done(null, false, {
      message: 'username already exists'
    })
  }
}

passport.use("local", new Local(myLocalStrategy))
passport.use("local-signup", new Local(mySignupStrategy))

passport.serializeUser((user, done) => done(null, user.username))

// "name" below refers to whatever piece of info is serialized in seralizeUser,
// in this example we're using the username
passport.deserializeUser((username, done) => {
  const user = db.get('users')
    .find({
      username: username
    })
    .value()

  if (user !== undefined) {
    done(null, user)
  } else {
    done(null, false, {
      message: 'user not found; session not restored'
    })
  }
})

function calcEuroPrice(usd) {
  return (usd * 0.91).toFixed(2);
}

function sortData() {
  // sort the data to ensure favorite are always first 3 elements
  //console.log("IN SORT")
  db.get('items').sortBy("rating").value();

  //console.log(sorted)
  //appdata.sort((a, b) => (a.rating < b.rating) ? 1 : (a.rating === b.rating) ? ((a.usd > b.usd) ? 1 : -1) : -1);
}

// ROUTING
// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/views/login.html');
});

app.get('/items', function (req, res) {
  console.log(req.user)
  if (req.user == undefined) {
    res.writeHead(404, {
      'Content-Type': 'text/html'
    })
    res.end();
  } else {
    sortData();

    const items = db.get('items').filter(__user => __user.user === req.user.username).value(); // get all items for this user

    if (items === undefined) {
      console.log("no data for this user")
      res.end()
    } else {
      console.log("sending data to client")
      res.json(items)
    }
  }
});

app.get('/index', function (req, res) {
  console.log(req.user)
  if (req.user == undefined) {
    console.log("undefined user")
    res.writeHead(404, {
      'Content-Type': 'text/html'
    })
    res.end();
  } else {
    res.sendFile(__dirname + '/views/index.html');
  }
});

//adds a new item
app.post('/items', function (req, res) {
  let data = req.body
  let user = req.user ? req.user.username : "no user"

  const newItemObj = {
    'id': shortid.generate(),
    'user': user,
    'name': data.name,
    'category': data.category,
    'rating': parseInt(data.rating),
    'usd': parseFloat(data.usd),
    'eur': calcEuroPrice(parseFloat(data.usd)),
    'link': data.link,
  }

  db.get('items').push(newItemObj).write();

  sortData();

  res.writeHead(200, "OK", {
    'Content-Type': 'text/plain'
  })
  res.send()
})

app.post(
  '/login',
  passport.authenticate('local'),
  function (req, res) {
    res.json({
      username: req.user.username
    })
  })

app.post('/register',
  passport.authenticate('local-signup'),
  function (req, res) {
    res.json({
      username: req.user.username
    })
  })


//updates an existing item
app.put('/items', function (request, response) {
  let data = request.body;

  // name
  db.get('items')
    .find({
      id: data.id
    })
    .assign({
      name: data.name
    })
    .write()

  // category
  db.get('items')
    .find({
      id: data.id
    })
    .assign({
      category: data.category,
    })
    .write()

  // rating
  db.get('items')
    .find({
      id: data.id
    })
    .assign({
      rating: parseInt(data.rating),
    })
    .write()

  // price - usd
  db.get('items')
    .find({
      id: data.id
    })
    .assign({
      usd: parseFloat(data.usd),
    })
    .write()

  // price - euro
  db.get('items')
    .find({
      id: data.id
    })
    .assign({
      eur: calcEuroPrice(parseFloat(data.usd)),
    })
    .write()

  // link
  db.get('items')
    .find({
      id: data.id
    })
    .assign({
      link: data.link,
    })
    .write()

  response.writeHead(200, "OK", {
    'Content-Type': 'text/plain'
  });
  response.end();
})

// deletes an existing item
app.delete('/items', function (request, response) {
  let data = request.body;

  db.get('items')
    .remove({
      id: data.id
    })
    .write()

  sortData();

  response.writeHead(200, "OK", {
    'Content-Type': 'text/plain'
  })
  response.end()

})

// listen for requests :)
const listener = app.listen(port, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});