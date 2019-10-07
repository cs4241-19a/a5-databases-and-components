const express = require( 'express' ),
      mongodb = require( 'mongodb' ),
      mongoose = require('mongoose'),
      path    = require( 'path'    ),
      app = express()

app.use( express.static('public') )
app.use( express.json() )

//view engine?
//app.set('view engine', 'ejs');
//app.use(express.static(path.join(__dirname, 'public')));
app.engine('html', require('ejs').renderFile);

const uri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+'/'+process.env.DB

const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
//mongoose.connect("mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+'/'+process.env.DB", {useNewUrlParser: true});
let collection = null

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'users' ).createCollection( 'movies' )
  })
  .then( __collection => {
    // store reference to collection
    collection = __collection
    // blank query returns all documents
    return collection.find({ }).toArray()
  })
  .then( console.log )

app.use((req, res, next) =>{
  if(collection !== null){
    next()
  }else{
    res.status(503).send()
  }
});

//app.use(passport.initialize())
app.use( require('express-session')({ secret:'cats cats cats', resave:false, saveUninitialized:false }));


  app.use( (req,res,next) => {
    if( collection !== null ) {
      next()
    }else{
      res.status( 503 ).send()
    }
  })

// route to get all docs
app.get( '/', (req,res) => {
  if( collection !== null ) {
    // get array and pass to res.json
    const getMovies = async function(){
      await collection.find({ }).toArray().then( result => res.json( result ) )
    }
     res.sendFile('views/home.html', {root: __dirname});
  }
})
/*
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function(){
  var movieSchema = new mongoose.Schema({
    ID: Number,
    Title: String,
    Genre: String,
    Rating: Number,
  })
  
  var PostTable = mongoose.model('Post', movieSchema)

  
  });
  */
// route to get all data
  // app.get( '/', (req,res) => {
  // //   db.PostTable.find({name:'users'}, function(data){
  // //     res.send(JSON.stringify(data))
  // //   })
  //   if( collection !== null ) {
  //     // get array and pass to res.json
  //     //collection.sendFile(res, '/home.html')
  //     await collection.find({ }).toArray().then( result => res.json( result ) )
  //     res.render('home.html')
  //   }
  // })
  
app.listen( 3000 )

  app.post( '/add', (req,res) => {
    // assumes only one object to insert
    collection.insertOne( req.body ).then( result => res.json( result ) )

  })

  // assumes req.body takes form { _id:5d91fb30f3f81b282d7be0dd } etc.
  app.post( '/remove', (req,res) => {
    collection
      .deleteOne({ _id:mongodb.ObjectID( req.body._id ) })
      .then( result => res.json( result ) )
  })

  app.post( '/update', (req,res) => {
    collection
      .updateOne(
        { _id:mongodb.ObjectID( req.body._id ) },
        { $set:{ name:req.body.name } }
      )
      .then( result => res.json( result ) )
  })


  app.get('/data', 
      function(req,res){
          if( collection !== null ) {
          // get array and pass to res.json
          const getMovies = async function(){
            await collection.find({ }).toArray().then( result => res.json( result ) )
          }
           res.sendFile('views/home.html', {root: __dirname});
        }
  })
  

