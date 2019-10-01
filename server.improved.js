const http = require('http'),
	fs   = require('fs'),
	// IMPORTANT: you must run `npm install` in the directory for this assignment
	// to install the mime library used in the following line of code
	mime = require('mime'),
	dir  = 'public/',
	port = 3000,
	Express = require('express'),
	express = Express(),
	bodyParser = require('body-parser'),
	serveStatic = require('serve-static'),
	serveFavicon = require('serve-favicon'),
	morgan = require('morgan'),
	cookieParser = require('cookie-parser'),
	session = require('express-session'),
	db = require('./public/db'),
	dbFile = require('./object.json'),
	path = require('path'),
  assert = require('assert'),
  MongoClient = require('mongodb').MongoClient,
  uri = "mongodb+srv://mongo:wordpass@cluster0-t5tln.azure.mongodb.net/test?retryWrites=true&w=majority",
  client = new MongoClient(uri, { useUnifiedTopology: true, useNewUrlParser: true });

let collection = null;
client.connect(function(err, client){
  assert.equal(null, err)
    collection = client.db("pirates").collection("crew");
	  // perform actions on the collection object
	  client.close();
});

if( collection !== null ) {
  collection.find({ }).toArray()
        .then(function(numItems) {
        console.log(numItems);
  });
}


express.use(bodyParser.urlencoded());
express.use(bodyParser.json());
express.use(session({
	secret: 'eggnog',
	resave: true,
	saveUninitialized: true
}));
express.use(morgan('dev')); 
express.use(cookieParser());
express.use(serveStatic(path.join(__dirname, 'public')));
express.use(serveFavicon(path.join(__dirname, 'public', 'favicon.ico')));

express.get("/", function (request, response) {
	sendFile(response, '/crew.html');
});

express.get("/crew", function (request, response) {
	response.redirect('/crew.html');
});

express.get("/crewdata", function(req,res){
  if( collection !== null ) {
    collection.find({ }).toArray().then( result => res.json( result ) )
  }
});


express.post('/addcrewmem', function(req,res) {
  let newData = req.body;
  var age = (2019 - parseInt(newData.year));
	var ageString = age + " Year(s) Old";
  if( collection !== null ) {
    collection.insertOne({
      age : ageString,
      name : newData.name,
      rank : newData.rank,
      year : newData.year,
      "Rand Id": parseInt(newData.rankID)
    })
    collection.find({ }).toArray().then( result => res.json( result ) )
  }
});

express.post('/modcrewmem', function(req,res) {
  let newData = req.body;
  var age = (2019 - parseInt(newData.year));
	var ageString = age + " Year(s) Old";
  if( collection !== null ) {
    collection.replaceOne(
      {name : newData.name},{
        $set:{
        age : ageString,
        name : newData.name,
        rank : newData.rank,
        year : newData.year,
        "Rand Id": parseInt(newData.rankID)
    }})
    collection.find({ }).toArray().then( result => res.json( result ) )
  }
});

express.post('/delcrewmem', function(req,res) {
 if( collection !== null ) {
    collection.deleteOne({
      name : req.body.name,
    })
    collection.find({ }).toArray().then( result => res.json( result ) )
  }
});


const sendFile = function(response, filename) {
	const type = mime.getType(filename); 

	fs.readFile(filename, function(err, content) {

		// if the error = null, then we've loaded the file successfully
		if(err === null) {

			// status code: https://httpstatuses.com
			response.writeHeader(200, { 'Content-Type': type });
			response.end(content);

		}else{

			// file not found, error code 404
			response.writeHeader(404);
			response.end('404 Error: File Not Found');

		}
	});
};

function saveUsers(){
	var json = JSON.stringify(db.users.getUsers());
	console.log(json);
  
	fs.writeFile("./object.json", json, (err) => {
		if (err) {
			console.error(err);
			return;
		};
		console.log("File has been created");
	});
}


var listener = express.listen(process.env.PORT, function () {
	console.log('Listening to port ' + listener.address().port);
});

