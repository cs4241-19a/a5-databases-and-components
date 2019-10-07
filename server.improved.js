const express = require( 'express' ),
    app = express(),
    bodyParser = require( 'body-parser' ),
    session   = require( 'express-session' ),
    passport  = require( 'passport' ),
    Local     = require( 'passport-local' ).Strategy,
    serveStatic = require('serve-static'),
    compression = require('compression'),
    mongodb = require('mongodb'),
    //helmet = require('helmet'),
    port = 3000;


const uri = 'mongodb+srv://amandaeze97:12345@cluster0-teapc.mongodb.net/admin?retryWrites=true&w=majority';
const client = new mongodb.MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
let orderData = null;
let userData = null;

app.use( serveStatic( 'public' ) );
app.use( bodyParser.json() );
app.use( compression() );

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'RiceBowls' ).createCollection( 'orders' )
  })
  .then( __collection => {
    // store reference to collection
    orderData = __collection
    // blank query returns all documents
    return orderData.find({ }).toArray()
  })
  .then( console.log )

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'RiceBowls' ).createCollection( 'users' )
  })
  .then( __collection => {
    // store reference to collection
    userData = __collection
    // blank query returns all documents
    return orderData.find({ }).toArray()
  })
  .then( console.log )

app.use( session({ secret:'hello world 1234', resave: false, saveUninitialized: false }) );
app.use( passport.initialize() );
app.use( passport.session() );
//app.use( helmet() );

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

passport.serializeUser( ( user, done ) => 
  done( null, user.username ) );

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

    const price = calculatePrice(parseInt(order.typeOfGrain), parseInt(order.typeOfProtein));

    const newOrder = {
        'user': request.session.passport.user,
        'fstname': order.fstname,
        'lstname': order.lstname,
        'ordername': order.ordername,
        'amountOfGrain': parseInt(order.typeOfGrain),
        'typeOfProtein': parseInt(order.typeOfProtein),
        'price': price
    };

    orderData.insertOne(newOrder).then(result => console.log(result));

    response.writeHead( 200, "OK", {'Content-Type': 'application/json' });
    response.end();
});

app.post('/update', function (request, response) {
    const orderToUpdate = request.body;

    const newPrice = calculatePrice(parseInt(orderToUpdate.typeOfGrain), parseInt(orderToUpdate.typeOfProtein));
  
    console.log(orderToUpdate);

    // const updatedOrder = {
    //     'fstname': orderToUpdate.fstname,
    //     'lstname': orderToUpdate.lstname,
    //     'ordername': orderToUpdate.ordername,
    //     'typeOfGrain': parseInt(orderToUpdate.typeOfGrain),
    //     'typeOfProtein': parseInt(orderToUpdate.typeOfProtein),
    //     'price': newPrice
    // };
       orderData.updateOne({_id:mongodb.ObjectDB(orderToUpdate.index)}, {
         $set: {
           fstname: orderToUpdate.fstname,
           lstname: orderToUpdate.lstname,
           ordername: orderToUpdate.ordername,
           typeOfGrain: parseInt(orderToUpdate.typeOfGrain),
           typeOfProtein: parseInt(orderToUpdate.typeOfProtein),
           price: newPrice
         }
       }).then("Your order was updated!")

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

const calculatePrice = function (typeOfGrain, typeOfProtein) {
  const baseRiceBowlPrice = 9;
  const price = baseRiceBowlPrice + typeOfGrain + typeOfProtein;
  return price;
};

app.listen( port );