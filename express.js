const express = require('express'),
      app = express(),
      Local = require('passport-local').Strategy,
      passport = require('passport'),
      session = require('express-session'),
      bodyParser = require('body-parser'),
      mongoose = require('mongoose'),
      port = 3000,
      path = require('path'),
      dir = ".//"

mongoose.connect('mongodb+srv://expenseUser:charlierocks@cluster0-jv1fw.mongodb.net/app?retryWrites=true&w=majority', { useNewUrlParser: true });

var credentials = null

app.use( session({ secret:'cats cats cats', resave:false, saveUninitialized:false }) )
app.use(passport.initialize())
app.use(passport.session());

var expenseSchema = new mongoose.Schema({index: Number, amount: String, category: String, month: String, username: String})
var userSchema = new mongoose.Schema({username: String, password: String})
var countSchema = new mongoose.Schema({count: Number})

var User = mongoose.model('User', userSchema)
var Expense = mongoose.model('Expense', expenseSchema)
var Count = mongoose.model('Count', countSchema)

var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', function () {

      console.log('connected to database');
    // all authentication requests in passwords assume that your client
    // is submitting a field named "username" and field named "password".
    // these are both passed as arugments to the authentication strategy.
    const myLocalStrategy = function( username, password, done ) {
      // find the first item in our users array where the username
      // matches what was sent by the client. nicer to read/write than a for loop!
      //const user = users.find( __user => __user.username === username )
      User.findOne({ username: username }, function (err, user) {
        if (!user) {
          console.log("not a user")
            return done(null, false, { message: 'User not found' });
        }
        // if user is undefined, then there was no match for the submitted username
        if( user === undefined ) {
          console.log("undefined")
          /* arguments to done():
          - an error object (usually returned from database requests )
          - authentication status
          - a message / other data to send to client
          */
          return done( null, false, { message:'user not found' })
        }else if( user.password === password ) {
          console.log("match")
          credentials = username
          // we found the user and the password matches!
          // go ahead and send the userdata... this will appear as request.user
          // in all express middleware functions.
          return done( null, { username, password })
        }else{
          console.log("else")
          // we found the user but the password didn't match...
          return done( null, false, { message: 'incorrect password' })
        }
      })
    }

    // specify parser
    app.use(bodyParser .json());

    // Uses the css and javascript files
    app.use(express.static(__dirname + '/public'))

    // GET request for index.html
    app.get('/', (req, res) => res.sendFile(__dirname + '/public/login.html'))

    // GET request for login.html
    app.get('/login', (req, res) => res.sendFile(__dirname + '/public/login.html'))

    //get request for index
    app.get('/home', (req, res) => res.sendFile(__dirname + '/public/home.html'))

    // GET request for the table data 
    app.get('/tabledata', function (req, res) {
        Expense.find({username: credentials}, function (err, arr) {
        if (err) return console.error(err)
        res.send(JSON.stringify(arr))          
      })
    })

    // POST request for login
    passport.use( new Local( myLocalStrategy ) )

    app.post( 
      '/login',
      passport.authenticate( 'local', { successRedirect: '/home', failureRedirect: '/' }), 
      function( req, res ) {
        console.log(req.user)
        res.json({ status:true })
        req.on('end', function() { 
          // load data for user and change webpage
        })
      })

      // POST request for signing out
    app.post('/signout', function(req, res) {
      req.session.destroy()
      credential = ''
      
      res.redirect("/login.html")
      // /res.writeHead( 200, "OK", {'Content-Type': 'text/plain' })
      res.end()
    })
      
    // POST request for deleting database
    app.post('/deleteRow', function(req, res) {
      let deleteIndex = req.body.index
      console.log(deleteIndex)
      
      Expense.deleteOne({index: deleteIndex}, function (err) {
        console.log("row deleted")
        if (err) return console.error(err);
        res.writeHead(200, "OK", {'Content-Type': 'application/json' })
        res.end()
      })

      console.log("deleted an entry")
    })


    // POST request for modifying database
    app.post('/modifyRow', function(req, res) {
        let entry = req.body
        
        var amt = entry.amount
        var cat = entry.category
        var mon = entry.month
        var index = entry.index
        var username = credentials

        var query = {index: index, amount: amt, category: cat, month: mon, username: username}

        console.log(query)

        Expense.updateOne({index: index}, query, function (err, result) { 
          if(err) console.error(err)  
            console.log("row modified")
            res.writeHead(200, "OK", {'Content-Type': 'text/plain' })
            res.end()
        })
    })


    // POST request for table data
    app.post('/submit', function(req, res) {
            let data = req.body
        
            var amt = data.amount
            var cat = data.category
            var mon = data.month
            var index = null

            // incr count schema
            Count.updateOne({ count: { $gt: -1 } }, { $inc: { count: 1 } }, function (err) {
              if(err) console.error(err)
              // Get the new count
              Count.findOne({ count: { $gt: -1 } }, function (err, temp) {
                if(err) console.error(err)
                index = temp.count

                // add new expense
                var newExpense = new Expense({index: index, amount: amt, category: cat, month: mon, username: credentials})
            
                newExpense.save(function (err) {
                  console.log("new expense added")
                  if (err) return console.error(err);
                  res.writeHead( 200, "OK", {'Content-Type': 'application/json' })
                  res.end()
                });

              })
            })
    })

    // POST request for logging in
    app.post('/signup', function(req, res) {
        const body = req.body

        var user = body.username
        var pass = body.password

        var newUser = new User({username: user, password: pass})
        console.log("about to add new user")
        newUser.save(function (err, user) {  
          if (err) return console.error(err);
          res.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
          res.end()
        })
    })

    passport.serializeUser( ( user, done ) => done( null, user.username ) )

    // "name" below refers to whatever piece of info is serialized in seralizeUser,
    // in this example we're using the username
    passport.deserializeUser( ( username, done ) => {
      User.findOne({ username: username }, function (err, user) {
        console.log( 'deserializing:', username )
        credential = username
        
        if( user !== undefined ) {
          done( null, user )
        }else{
          done( null, false, { message:'user not found; session not restored' })
        }

      })
    })

    app.listen( process.env.PORT || 3000 ) 
});