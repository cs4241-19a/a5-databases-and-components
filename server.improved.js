const mongo = require('mongodb');
const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
const FileAsync = require('lowdb/adapters/FileAsync');
const bodyParser = require('body-parser');
const compression = require('compression');
const express = require('express'),
    session   = require( 'express-session' ),
    app = express(),
    port = 3000;

const adapter = new FileAsync('./public/json/users.json');

app.use( session({ secret:'somesecrethere', resave: false, saveUninitialized: false }) );
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(passport.initialize());
app.use(passport.session());

let uri = 'mongodb+srv://jyxiao:mongoexample@cluster0-g4tmu.mongodb.net/admin?retryWrites=true&w=majority';

const mongoClient = new mongo.MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true});
let users;
let productList;
let cart = null;

mongoClient.connect().then(()=>{
    return mongoClient.db('Users').collection('listofusers');
}).then(getUsers => {
    users = getUsers;
    return getUsers.find().toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
    });
});

mongoClient.connect().then(()=>{
    return mongoClient.db('Users').collection('listofproducts');
}).then(getProducts => {
    productList = getProducts;
    return getProducts.find().toArray(function (err, result) {
        if (err) throw err;
        console.log(result);
    });
});

passport.use(new LocalStrategy (
    function(username, password, done) {
        users.findOne({username: username}).then((user, err) => {
            if (err) {
                return done(err);
            }
            if (!user) {
                return done(null, false, { message: 'User not found.'});
            }
            if (user.password !== password) {
                return done(null, false, { message: 'Incorrect password.'});
            }else{
                return done(null, user);
            }
        })
    }
));

passport.serializeUser( (user, done) => done(null, user.username));

passport.deserializeUser( (username, done) => {
    users.findOne({
        username: username
    }).then(user => {
        if( user !== undefined ) {
            done(null, user);
            console.log(user);
        }else{
            done(null, false, {message: 'User not found.'});
        }
    });
});

// Create database instance and start server
mongoClient.connect()
    .then(() => {
        app.use(express.static('public'));
        app.get('/', (request, response) => {
            response.sendFile(__dirname + '/public/index.html');
        });

        app.get('/index', (request, response) => {
            response.sendFile(__dirname + '/public/index.html');
        });

        app.get('/cart', (request, response) => {
            response.sendFile(__dirname + '/public/cart.html');
        });

        app.get('/login', (request, response) => {
            response.sendFile(__dirname + '/public/login.html');
        });

        app.get('/register', (request, response) => {
            response.sendFile(__dirname + '/public/register.html');
        });

        app.get('/store', (request, response) => {
            response.sendFile(__dirname + '/public/store.html');
        });

        app.post('/loginAttempt',
            passport.authenticate('local', {
                successRedirect: '/store',
                failureRedirect: '/login'}),
            function(request, response) {
                response.json({status: true});
            });

        app.post('/logoutAttempt',
            function(request, response) {
                request.logout();
                response.redirect("/login");
            });

        app.post('/registerAttempt', function (request, response) {
            users.findOne({
                username: request.body.username
            }).then(result => {
                if (result === null) {
                    users.insertOne({
                        username: request.body.username,
                        password: request.body.password
                    });
                    response.send(JSON.stringify({status: true}))
                } else {
                    response.send(JSON.stringify({status: false}))
                }
            })
        });

        app.post('/addToCart', function (request, response) {
            const productID = request.body["id"];
            productList.findOne({id : productID}).then(product =>{
                users.findOne({username: request.session.passport.user}).then(usr =>{
                    const total = addItem(product["price"], usr["total"]);
                    let cart = usr["cart"];
                    cart.append(product);
                    usr.update({cart: cart}).then(result => console.log(result));
                });
            });
/*
            $.getJSON('./public/json/products.json', function(productList) {
                product = productList[productID];
                console.log(product);
            });
*/
        });

        app.post('/removeFromCart', function (request, response) {
            const productID = request.body.productID;
            if(cart === null){
                response.writeHead( 200, "FALSE", {'Content-Type': 'application/json' });
                response.end();
            }else{
                cart.deleteOne({
                    _id: mongoClient.ObjectID(productID)
                }).then(result => console.log(orderNumber));
                response.writeHead( 200, "OK", {'Content-Type': 'application/json' });
                response.end();
            }
        });
    })
    .then(() => {
        app.listen(port, () => console.log('listening on port 3000'))
    });

function addItem(item, total){
    const shippingCosts = 2.49;
    total += item;
    return total + shippingCosts;
}