console.log("Reading server");

const port = 3000;


const express = require( 'express' ),
      mongodb = require( 'mongodb' ),
	  bodyParser = require( 'body-parser'),
      app = express()
	  

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
  

app.get( '/allPosts', (req,res) => {
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


app.post('/clearLog', (req, res) => {
	db.collection.remove(
	{},
   {
     justOne: false,
     writeConcern: {},
   }
)
	res.send(req.body);
  
})	;

  
const listener = app.listen(port, function() {
  console.log('Your app is listening on port ' + listener.address().port);
}); 

