const http = require( 'http' ),
      fs   = require( 'fs' ),
      express = require('express'),
      app = express(),
      session   = require( 'express-session' ),
      passport  = require( 'passport' ),
      Local     = require( 'passport-local' ).Strategy,
      responseTime = require('response-time'), 
      bodyParser = require( 'body-parser' ),
      helmet = require('helmet'),
      crypto = require('crypto'),
      mongoose = require('mongoose'),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library used in the following line of code
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3002

app.use( express.static('./') )
app.use( bodyParser.json() ) 
app.use( session({ secret: 'scoobyDoo', resave:false, saveUninitialized:false} ) )
app.use( responseTime())
app.use( helmet())



//Mongodb Connection Setup
//const uri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+'/'+process.env.DB
const uri = 'mongodb+srv://webware-cat:Shermanator@cs4241-a5-eqo5u.mongodb.net/test?retryWrites=true&w=majority'

mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true })

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connection Successful!")
});

const userSchema = new mongoose.Schema({
  username: String,
  password: Object, 
  tasks: Array
});

const taskSchema = new mongoose.Schema({
  itemName: String,
  time: String, 
  dueDate: String,
  notes: String
});

const passwordSchema = new mongoose.Schema({
  salt: String, 
  hash: String 
});

const User = mongoose.model('User', userSchema)
const Task = mongoose.model('Task', taskSchema)
const Password  = mongoose.model('Password', passwordSchema)

// Passport Authentication 
const myLocalStrategy = function( username, password, done ) {
  User.findOne({ username: username}, function(err, user){
    if(err){ 
      console.log("ERROR")
    }
    else{ 
      if( user === undefined) {
        return done( null, false, { message:'user not found' })
      }
      const salt = user.password.salt
      const hash = sha512(password, salt)
      if( user.password.hash === hash ) {
        return done( null, { username, password})
      }else{
        return done( null, false, { message: 'incorrect password' })
      }
    }
  })
}

passport.serializeUser( ( user, done ) => done( null, user.username ) )

passport.deserializeUser( ( username, done ) => {
  User.findOne({ username: username}, function(err, user){
    if(err){ 
      console.log("ERROR")
    }
    else{ 
      if(user !== undefined) {
        done( null, user )
      }
      else{
        done( null, false, { message:'user not found; session not restored' })
      }
    }
  })
})

passport.use( new Local( myLocalStrategy ) )
app.use(passport.initialize())
app.use(passport.session())

// Password Hashing Stuff, from https://ciphertrick.com/salt-hash-passwords-using-nodejs-crypto/
//generates some NaCl (salt)
function genRandomString (length){
  return crypto.randomBytes(Math.ceil(length/2))
          .toString('hex') /** convert to hexadecimal format */
          .slice(0,length);   /** return required number of characters */
};

//generating the hash
function sha512(password, salt){
  var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
  hash.update(password);
  var value = hash.digest('hex');
  return value;
};

//GET Resquest Paths:  
app.get('/', (req, res) => {
  res.sendfile('public/index.html')
})

app.get('/index.html', (req, res) => {
  res.sendfile('public/index.html')
})

app.get('/index.css', (req, res) => {
  res.sendfile('public/css/index.css')
})

app.get('/index.js', (req, res) => {
  res.sendfile('public/js/index.js')
})

app.get('/userpage.html', (req, res) => {
  res.sendfile('public/userpage.html')
})

app.get('/userpage.css', (req, res) => {
  res.sendfile('public/css/userpage.css')
})

app.get('/userpage.js', (req, res) => {
  res.sendfile('public/js/userpage.js')
})

app.get('/accessData', (req, res) => {
  User.find({}, function(err, users){
    if(err){ 
      console.log("ERROR")
      res.status(400).send({})
    }
    else{
      res.send(users)
    }
  })
})

app.get('/loadUserInfo', (req,res) => {
  const data = { username: req.user.username}
  res.send(data)
})

app.get('/loadTable', (req,res) => {
  const data = {tasks: req.user.tasks}
  res.send(data)
})

//POST Request Paths: 
app.post( 
  '/login',
  passport.authenticate( 'local'),
  function( req, res ) {
    res.status(200).send({})
  }
)

app.post( 
  '/createAccount',
  function( req, res ) {
    User.find({ username: req.body.username }, function(err, users){
      if (err) {
        res.status(400).send({})
      }
      else{
        if(users.length > 0){
          res.status(401).send({})
        }
        else{
          const salt = genRandomString(5)
          const hash = sha512(req.body.password, salt)
          const password = new Password({"hash":hash, "salt":salt})
          const newUser = new User({username: req.body.username, password: password, tasks:[]})
          console.log(newUser)
          newUser.save(function (err, newUser){})
          res.status(200).send({})
        }
      }
    })
  }
)

app.post(
  '/addTask',
  function(req, res){ 
    const newTask = new Task(req.body.task)
    const query = {'username':req.user.username}
    const newData = {tasks: req.user.tasks}
    newData.tasks.push(newTask)
    User.findOneAndUpdate(query, newData, {upsert:true}, function(err, doc){
        if (err) return res.send(500, { error: err })
        return res.status(200).send({})
    })    
  }
)

app.post(
  '/deleteTask',
  function(req, res){ 
    const query = {'username':req.user.username}
    const newData = {tasks: req.user.tasks.filter(function(value, index, arr){
      return value._id != req.body._id
    })}
    User.findOneAndUpdate(query, newData, {upsert:true}, function(err, doc){
        if (err) return res.send(500, { error: err })
        return res.status(200).send({})
    })  
  }
)

app.post( 
  '/dropModForm', 
  function(req, res){ 
    const tasks = req.user.tasks.filter(function(value, index, arr){
      return value._id == req.body._id
    })
    if (tasks.length !== 1){
      res.status(400).send({})
    }
    else{ 
      res.send(tasks[0])
    }
  }
)

// NEED TO DO
app.post( 
  '/modifyTask', 
  function(req, res){ 
    const query = {'username':req.user.username}
    const newData = {tasks: req.user.tasks}
    newData.tasks.forEach(function(element) {
      if(element._id == req.body._id){
        element.itemName = req.body.task.itemName
        element.time = req.body.task.time
        element.dueDate =req.body.task.dueDate
        element.notes =req.body.task.notes
      }
    })

    User.findOneAndUpdate(query, newData, {upsert:true}, function(err, doc){
        if (err) return res.send(500, { error: err })
        return res.status(200).send({})
    }) 
  }
)

app.listen( process.env.PORT || port )