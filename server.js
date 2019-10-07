console.log("Reading server");

const port = 3000;

//const express = require('express');


//const bodyParser = require('body-parser')
//const couchdb = require('node-couchdb')
//const low = require('lowdb')
//const FileSync = require('lowdb/adapters/FileSync')

//const adapter = new FileSync('db.json')
//const db = low(adapter)
//const app = express();
//app.use(bodyParser.urlencoded({ extended: true}));;
//app.use(express.static('public'));
//app.use(bodyParser.json());


//setting up user db
/*db.defaults({ posts: [], user: {}, count: 0, balance: 100 })
  .write()
*/







const express = require( 'express' ),
      mongodb = require( 'mongodb' ),
	  bodyParser = require( 'body-parser'),
      app = express()
	  
require('dotenv').config()

app.use( express.static('public') )
app.use( express.json() )
console.log(process.env.HOST);
const uri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+'/'+process.env.DB
const client = new mongodb.MongoClient( uri, { useNewUrlParser: true,  useUnifiedTopology: true }, function(err)
	{
		if (err){
			return console.log("ERROR Conection Failed")
		}
	});
let collection = null

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'a5db' ).createCollection( 'a5collection' )
  })
  .then( __collection => {
    // store reference to collection
    collection = __collection
    // blank query returns all documents
    return collection.find({ }).toArray()
  })
  .then( console.log )
  
// route to get all docs
/*const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dkaravoussianis:Password1234@a5-5yqsc.mongodb.net/admin?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true  , useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("a5db").collection("A5");
  // perform actions on the collection object
  console.log("Connected, inside");
  client.close();
});
*/


app.get( '/', (req,res) => {
  if( collection !== null ) {
   //  get array and pass to res.json
    collection.find({ }).toArray().then( result => res.json( result ) )
  }
})

app.post('/', function(request, response) {
    response.sendFile(__dirname + '/views/index.html');
});

app.post( '/submit', (req,res) => {
  // assumes only one object to insert
  console.log("In Submit");
  collection.insertOne( req.body ).then( result => res.json( result ) )
  console.log(req.body);
  res.send(req.body);
})

/*app.post('/submit', (req, res) => {

	db.get('posts')
	.push(req.body)
	.write()
	  
	// Increment count
	db.update('count', n => n + 1)
	  .write()
	  
	console.log(req.body.win);
	if (req.body.win == true)
	{
		db.update('balance', n => n + req.body.bet)
		  .write()
	}
	else
	{
		db.update('balance', n => n - req.body.bet)
		  .write()
	}
	console.log(db.get('balance').value())
	res.send(req.body);
  
  
  
}) 

app.post ('/allPosts', (req, res) => {
	json = {post: db.get('posts'), count: db.get('count'), balance: db.get('balance')};
	body = JSON.stringify(json);
	console.log(body);
	res.send(body);
	
});



app.post('/clearLog', (req, res) => {
//	const newState = {}
	db.set('posts', [])
  
  .write()
	
	db.set('count', 0)
  .write()
  
//	console.log(db.get('posts'));
	
	res.send(req.body);
  
})	;
	
	

*/

// listen for requests :) 
/*
const listener = app.listen(port, function() {
  console.log('Your app is listening on port ' + listener.address().port);
}); 
 */


  
  
const listener = app.listen(port, function() {
  console.log('Your app is listening on port ' + listener.address().port);
}); 

