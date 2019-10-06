const express = require( 'express' ),
    app = express(),
    bodyParser = require( 'body-parser' ),
    session   = require( 'express-session' ),
    passport  = require( 'passport' ),
    Local     = require( 'passport-local' ).Strategy,
    serveStatic = require('serve-static'),
    compression = require('compression'),
    mongodb = require('mongodb'),
    port = 3000;

app.use( serveStatic( 'public' ) );
app.use( bodyParser.json() );

const uri = 'mongodb+srv://ciduarte:cs4241a5@cluster0-cewac.mongodb.net/admin?retryWrites=true&w=majority';
// const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@${process.env.HOST}/${process.env.DB}`;

const client = new mongodb.MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
let userData = null;
let orderData = null;

client.connect()
  .then(()=>{
    return client.db('Ramen').createCollection('users');
  })
  .then(__collection => {
    userData = __collection;
    return userData.find({}).toArray();
  })
  .then(console.log);

client.connect()
  .then(()=>{
    return client.db('Ramen').createCollection('orders');
  })
  .then(__collection => {
    orderData = __collection;
    return orderData.find({}).toArray();
  })
  .then(console.log);

app.use( compression() );
app.use( session({ secret:'cats cats cats', resave: false, saveUninitialized: false }) );
app.use( passport.initialize() );
app.use( passport.session() );

//////////// PASSPORT CONFIGURATION ////////////
passport.use(new Local (
    function(username, password, done) {
      userData.findOne({
        username: username
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'User does not exist.'});
        }

        if (user.password !== password) {
          return done(null, false, { message: 'Incorrect password.' });
        } else {
          return done(null, user);
        }
      })
    }
));

passport.serializeUser( ( user, done ) => done( null, user.username ) );

passport.deserializeUser( ( username, done ) => {
  userData.findOne({
    username: username
  }).then(user => {
    if( user !== undefined ) {
      done( null, user )
    }else{
      done( null, false, { message:'user not found; session not restored' })
    }
  });
});

//////////// SERVER METHODS ////////////

app.get('/', function (request, response) {
    response.sendFile(__dirname + '/public/login.html');
});

app.post('/login',
    passport.authenticate('local'),
    function (request, response) { response.json({status: true})
    });

app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login.html');
});

app.get('/orders', function (request, response) {
  orderData.find({
    user: request.session.passport.user
  }).toArray().then(orders => {
    if (orders === undefined) {
      response.send(JSON.stringify({data: []}))
    } else {
      response.send(JSON.stringify({data: orders}))
    }
  });
});

app.post('/createAccount', function (request, response) {
  userData.findOne({
    username: request.body.username
  }).then(result => {
    if (result === null) {
      userData.insertOne({
        username: request.body.username,
        password: request.body.password
      });
      response.send(JSON.stringify({status: true}))
    } else {
      response.send(JSON.stringify({status: false}))
    }
  })
});

app.post('/submit', function (request, response) {
    const order = request.body;

    const price = calculatePrice(parseInt(order.amountOfPork), parseInt(order.garlic));

    const newOrder = {
      'user': request.session.passport.user,
      'name': order.name,
      'dream': order.dream,
      'amountOfPork': parseInt(order.amountOfPork),
      'garlic': parseInt(order.garlic),
      'price': price
    };

    orderData.insertOne(newOrder).then(result => console.log(result));

    response.writeHead( 200, "OK", {'Content-Type': 'application/json' });
    response.end();
});

app.post('/update', function (request, response) {
    const orderToUpdate = request.body;

    const newPrice = calculatePrice(parseInt(orderToUpdate.amountOfPork), parseInt(orderToUpdate.garlic));

  console.log(orderToUpdate);

    orderData.updateOne(
      { _id:mongodb.ObjectID(orderToUpdate.index)},
      { $set:{
        name: orderToUpdate.name,
          dream: orderToUpdate.dream,
          amountOfPork: parseInt(orderToUpdate.amountOfPork),
          garlic: parseInt(orderToUpdate.garlic),
          price: newPrice
      }}
    ).then(result => console.log(orderToUpdate.index));

    response.writeHead( 200, "OK", {'Content-Type': 'application/json' });
    response.end();
});

app.post('/delete', function (request, response) {
    const orderNumber = request.body.orderNumber;

    console.log(request.body);

    orderData.deleteOne({
      _id: mongodb.ObjectID(orderNumber)
    }).then(result => console.log(orderNumber));

    response.writeHead( 200, "OK", {'Content-Type': 'application/json' });
    response.end();
});

const calculatePrice = function (amountOfPork, ifGarlic) {
  const baseRamenPrice = 7;
  const price = (baseRamenPrice + (2*amountOfPork) + ifGarlic);
  return price;
};

app.listen( port );
