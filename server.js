// init project
const http = require('http');
const express = require('express');
const app = express();
const fs = require('fs');
const mime = require('mime');
const moment = require('moment');
const dir = ('public/');
const port = 3000;
const favicon = require('serve-favicon');
const bodyParser = require('body-parser')
const serveStatic = require('serve-static')
const errorhandler = require('errorhandler')

const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('public/plays.json');
const db = low(adapter);

db.defaults({plays:[]}).write();
const MongoClient = require('mongodb').MongoClient;

const uri = "mongodb+srv://sdandeneau:sean1011@a5-sean-dandeneau-cluster-ybppr.mongodb.net/admin?retryWrites=true&w=majority"
MongoClient.connect(uri, function(err, client) {
   if(err) {
        console.log('Error occurred while connecting to MongoDB Atlas...\n',err);
   }
   console.log('Connected...');
   const collection = client.db("test").collection("devices");
   client.close();
});


const server = http.createServer( function( request,response ) {
  if( request.method === 'GET' ) {
    handleGet( request, response )    
  } else if( request.method === 'POST' ){
    handlePost( request, response )
  }
})

const handleGet = function(request,response) {
  const filename = dir + request.url.slice(1)
  
  if(request.url === '/') {
    sendFile(response,'views/index.html')
  } else if(request.url === '/getPlays') {
    sendFile(response, 'public/plays.json')
  } else {
    sendFile(response,filename)
  }
  
}


const handlePost = function(request,response) {
  
  let dataString = '';

  request.on('data', function(data) {
    dataString += data;
  })
  
  
  request.on('end', function() {
    console.log("Server received\n" + dataString);
    const obj = JSON.parse(dataString);
    
    //do something with data here
    db.get('plays').push(obj).write();

    //Attempting to write to mongodb, having issues
    //MongoClient.get('plays').push(obj).write();
    
    
    response.writeHead(200, "OK", {'Content-Type': 'text/plain' })
    response.end()
    
    
  })

}

const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we've loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHeader( 200, { 'Content-Type': type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( '404 Error: File Not Found' )

     }
   })
}

server.listen(process.env.PORT || port);
