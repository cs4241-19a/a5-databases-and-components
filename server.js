const http = require("http"),
  fs = require("fs"),
  mime = require("mime"),
  express = require("express"),
  bodyParser = require("body-parser"),
  FileSync = require("lowdb/adapters/FileSync"),
  session = require("express-session"),
  mongodb = require("mongodb"),
  dir = "public/",
  port = 3000,
  app = express()

app.use(bodyParser.json());
app.use(express.static("public"));

const checkData = function(error, json) {
  const volt = Number(json.voltage),
    curr = Number(json.current),
    [month, day, year] = json.date.split("/"),
    [hours, minutes] = json.time.split(":");
  if (volt <= 0) {
    console.log("Invalid Voltage value.");
    error += "Invalid Voltage value. ";
  }
  if (curr <= 0) {
    console.log("Invalid Current value.");
    error += "Invalid Current value. ";
  }
  if (month < 1 || month > 12) {
    console.log("Invalid Month.");
    error += "Invalid Month. ";
  }

  if (day < 1 || day > 31) {
    console.log("Invalid Day.");
    error += "Invalid Day. ";
  }

  if (year < 0 || year > 99) {
    console.log("Invalid Year.");
    error += "Invalid Year. ";
  }

  if (hours < 0 || hours > 24) {
    console.log("Invalid Hour");
    error += "Invalid Hour. ";
  }

  if (minutes < 0 || minutes > 59) {
    console.log("Invalid Minute.");
    error += "Invalid Minute. ";
  }
  return error;
}

const uri = "mongodb+srv://" + process.env.USER + ":" + process.env.PASS + "@" + process.env.HOST + "/" + process.env.DB,
      client = new mongodb.MongoClient(uri, {useNewUrlParser: true, useUnifiedTopology: true})

app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html")
})

app.post("/addData", function(request, response) {
  const json = request.body
  let error = ""
  error += checkData(error, json)
  if (error !== "") {
    error += "Data will not be recorded";
    response.writeHead(400, "OK", { "Content-Type": "text/plain" }) //Write a reponse back to client
    response.write(error)
    response.end()
  } 
  else {
    let collection = null  
    client.connect().then( () => {return client.db( 'Assignment5' ).createCollection( 'powerUsage' )})
    .then( __collection => {
      collection = __collection
      return collection.find({ }).toArray()
    })
    .then( data => {
      let userExists = false;
      for (let entry of data) {
        if (entry.username === json.username) {
          userExists = true
        }
      }
      json.power = json.voltage * json.current * json.current
      console.log(collection)
      collection.insertOne( json ).then( result => response.json( result ) )

      let message = "Data recorded. "
      if (userExists === false) {
        message += "New user created."
      }
      response.writeHead(200, "OK", { "Content-Type": "text/plain" }) //Write a reponse back to client
      response.write(message)
      response.end()
    })
  }
})

app.post("/delData", function(request, response) {
  const json = request.body
  
  let collection = null  
  client.connect().then( () => {return client.db( 'Assignment5' ).createCollection( 'powerUsage' )})
  .then( __collection => {
    collection = __collection
    return collection.find({ }).toArray()
  })
  .then( data => {
    console.log(json.id.trim())
    collection.deleteOne({ _id: mongodb.ObjectID( json.id.trim() )}).then( result => response.json( result ) )
  response.writeHead(200, "OK", { "Content-Type": "text/plain" }); //Write a reponse back to client
  response.write("If the record was found, it was deleted");
  response.end()
  })
})

app.post("/modData", function(request, response) {
  const json = request.body

  let error = "";
  error += checkData(error, json);

  if (error !== "") {
    error += "Data will not be modified";
    response.writeHead(400, "OK", { "Content-Type": "text/plain" }); //Write a reponse back to client
    response.write(error);
    response.end();
  } 
  else {
    json.power = json.voltage * json.current * json.current
    let collection = null  
    client.connect().then( () => {return client.db( 'Assignment5' ).createCollection( 'powerUsage' )})
    .then( __collection => {
      collection = __collection
      return collection.find({ }).toArray()
    })
    .then( data => {
      collection.updateOne({ _id:mongodb.ObjectID( json.id.trim() ) },
      { $set:{ 
        date:json.date, 
        time:json.time,
        voltage:json.voltage,
        current:json.voltage,
        power:json.power
        } 
      })
      .then( result => response.json( result ) )
     })
    
    response.writeHead(200, "OK", { "Content-Type": "text/plain" }); //Write a reponse back to client
    response.write("Data has been recorded");
    response.end();
  }
});

app.post("/getData", function(request, response) {
  const username = request.body.username,
        password = request.body.password
  let collection = null  
  client.connect().then( () => {return client.db( 'Assignment5' ).createCollection( 'powerUsage' )})
  .then( __collection => {
    collection = __collection
    return collection.find({ }).toArray()
  })
  .then(allData =>{
    console.log(allData)
    let userData = []
    if (username === "admin" && password === "admin") {userData = allData} 
    else {
      for (let entry of allData) {
        if (entry.username === username && entry.password === password) {userData.push(entry)}
      }
    }
    const dataString = JSON.stringify(userData);
    response.writeHead(200, "OK", { "Content-Type": "text/plain" }) //Write a reponse back to client
    response.write(dataString)
    response.end()
  })
})
        
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
