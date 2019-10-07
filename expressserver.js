const express = require('express'),
  mongoose = require('mongoose'),
  app = express(),
  session = require('express-session'),
  passport = require('passport'),
  Local = require('passport-local').Strategy,
  bodyParser = require('body-parser'),
  helmet = require('helmet'),
  favicon = require('serve-favicon'),
  path = require('path'),
  optimus = require('connect-image-optimus')

app.use(session({ secret: 'cats cats cats', resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())

// Mongoose
mongoose.connect('mongodb+srv://test:fantastic@cluster0-qa3kc.mongodb.net/hi?retryWrites=true&w=majority', { useNewUrlParser: true });

// schemas
var orderSchema = new mongoose.Schema({
  yourname: String,
  phone: String,
  potato: String,
  seasoning: String,
  size: String,
  ordernum: Number
})
var userSchema = new mongoose.Schema({
  username: String,
  password: String
})
var orderCountSchema = new mongoose.Schema({
  ordercount: Number
})

// model creation
var Order = mongoose.model('Order', orderSchema)
var User = mongoose.model('User', userSchema)
var OrderCount = mongoose.model('OrderCount', orderCountSchema)

// checks if mongoose properly connects
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {

  console.log('connection successful')

  // AUTHENTICATION
  const myLocalStrategy = function (username, password, done) {

    User.findOne({ username: username }, function (err, user) {
      if (!user) {
        return done(null, false, { message: 'user not found' });
      }

      if (user === undefined) {
        return done(null, false, { message: 'user not found' })
      } else if (user.password === password) {
        return done(null, { username, password })
      } else {
        return done(null, false, { message: 'incorrect password' })
      }
    })
  }


  // automatically deliver all files in the public folder
  // with the correct headers / MIME type.
  app.use(express.static('public'))

  // get json when appropriate - middleware
  app.use(bodyParser.json())

  // connect-image-optimus - middleware
  var staticPath = __dirname + '/static/'
  app.use(optimus(staticPath))

  // favicon - middleware
  app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

  // helmet - middleware
  app.use(helmet())

  // domain views index.html
  app.get('/', function (request, response) {
    response.sendFile(__dirname + '/views/index.html')
    response.send('hello, world!')
  })

  app.post('/test', function (req, res) {
    console.log('authenticate with cookie?', req.user)
    res.json({ status: 'success' })
  })

  // passport - middleware
  passport.use(new Local(myLocalStrategy))
  passport.initialize()

  app.post(
    '/login',
    passport.authenticate('local', { successRedirect: '/admin.html', failureRedirect: '/login.html' }),
    function (req, res) {
      res.json({ status: true })
    }
  )

  passport.serializeUser((user, done) => {
    console.log('serializing:', user.username)
    done(null, user.username)
  })

  passport.deserializeUser((username, done) => {
    User.findOne({ username: username }, function (err, user) {
      console.log('deserializing:', username)

      if (user !== undefined) {
        done(null, user)
      } else {
        done(null, false, { message: 'user not found; session not restored' })
      }
    })
  })


  // ORDERS
  // GET orders
  app.get('/orders', function (req, res) {
    Order.find({}, function (err, orders) {
      if (err) return console.error(err)
      res.send(JSON.stringify(orders))
    })
  })

  // POST update
  app.post('/update', function (request, response) {
    dataString = ''

    request.on('data', function (data) {
      dataString += data
    })

    request.on('end', function () {

      var updatedata = JSON.parse(dataString)
      var yourname = (updatedata.yourname)
      var phone = (updatedata.phone)
      var potato = (updatedata.potato)
      var seasoning = (updatedata.seasoning)
      var size = (updatedata.size)
      var ordernum = (updatedata.ordernum)

      var modifiedrow = { yourname: yourname, phone: phone, potato: potato, seasoning: seasoning, size: size, ordernum: ordernum }

      Order.updateOne({ ordernum: ordernum }, modifiedrow, function (err, result) {
        if (err) console.error(err)
        response.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
        response.end()
      })
    })
  })

  // POST remove
  app.post('/remove', function (request, response) {
    dataString = ''

    request.on('data', function (data) {
      dataString += data
    })

    request.on('end', function () {
      var removedata = JSON.parse(dataString)
      var ordernum = (removedata.ordernum)

      // deletes index
      Order.deleteOne({ ordernum: ordernum }, function (err) {
        if (err) return console.error(err);
        response.writeHead(200, "OK", { 'Content-Type': 'application/json' })
        response.end()
      })
    })
  })

  // POST submit
  app.post('/submit', function (request, response) {
    dataString = ''

    request.on('data', function (data) {
      dataString += data
    })

    request.on('end', function () {

      var order = JSON.parse(dataString)
      var yourname = (order.yourname)
      var phone = (order.phone)
      var potato = (order.potato)
      var seasoning = (order.seasoning)
      var size = (order.size)
      var ordernum
      /*   
request.on('end')
let data = request.body
console.log(data)
var yourname = (data.yourname)
var phone = (data.phone)
var potato = (data.potato)
var seasoning = (data.seasoning)
var size = (data.size)
var ordernum
*/

      // get current ordercount
      OrderCount.findOne({ ordercount: { $gt: -1 } }, function (err, num) {
        if (err) console.error(err)
        ordernum = num.ordercount

        // create order object
        var order = new Order({ yourname: yourname, phone: phone, potato: potato, seasoning: seasoning, size: size, ordernum: ordernum })

        // increment ordercount by 1
        OrderCount.updateOne({ ordercount: { $gt: -1 } }, { $inc: { ordercount: 1 } }, function (err) {
          if (err) console.error(err)
          // save order to Mongo
          order.save(function (err) {
            console.log("order added")
            if (err) return console.error(err);
            response.writeHead(200, "OK", { 'Content-Type': 'application/json' })
            response.end()
          })
        })
      })
    })
  })

  // POST add admin
  app.post('/addUser', function (request, response) {

    // add admin user temporarily
    var adminUser = new User({ username: 'admin', password: 'fantastic' })
    adminUser.save(function (err, user) {
      if (err) return console.error(err);
      response.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
      response.end()
    })
  })

  app.post('/establishorder', function (request, response) {

    // add admin user temporarily
    var order = new OrderCount({ ordercount: 1 })
    order.save(function (err, order) {
      if (err) return console.error(err);
      response.writeHead(200, "OK", { 'Content-Type': 'text/plain' })
      response.end()
    })
  })






  app.listen(process.env.PORT || 3000)



})