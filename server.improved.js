const express = require('express'),
      bodyParser = require("body-parser"),
      compression = require('compression'),
      helmet = require('helmet'),
      app = express(),
      timeout = require('connect-timeout'),
      cors = require('cors');

app.use(cors());

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));
app.use(compression({level: 1}))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use(helmet.referrerPolicy());
app.use(timeout('5s'));


// http://expressjs.com/en/starter/basic-routing.html
app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

app.post('/submit',
  function(request, response){
  
    let reading = request.body
    addRecord(reading).then(function(resolve){
      console.log(resolve)

      response.writeHeader( 200, { 'Content-Type': 'text/plain' })
      response.end("Ok");
    }).catch(err => console.log(err));
  });

app.post('/update_delete',
 function(request, response){
  readings = request.body
  updateRecord(readings.readings).then(function(resolve){
    console.log(resolve)

    response.writeHeader( 200, { 'Content-Type': 'text/plain' })
    response.end("Ok");
  }).catch(err => console.log(err))});

app.get('/reading_data',
  function(request, response){
    let readings_doc = firestore.doc("fsae_logger_a5/speed_logs")
    readings_doc.get().then(function(doc){
      response.json(doc.data().readings)
    })
  }
)

app.get('/aggregate_data',
  function(request, response){
    let readings_doc = firestore.doc("fsae_logger_a5/speed_logs")
    readings_doc.get().then(function(doc){
      response.json(doc.data().aggregate)
    })
  })

// listen for requests
const listener = app.listen(3000, function() {
  console.log('Your app is listening on port ' + listener.address().port);
});

const calculateAggr = function(data){
  let aggregate = {
    "Park":{"sum":0,"count":0},
    "Reverse":{"sum":0,"count":0},
    "1st Gear":{"sum":0,"count":0},
    "2nd Gear":{"sum":0,"count":0},
    "3rd Gear":{"sum":0,"count":0},
    "4th Gear":{"sum":0,"count":0},
    "5th Gear":{"sum":0,"count":0},
    "6th Gear":{"sum":0,"count":0},
  }

  data.forEach(re => {
    aggregate[re.gear].sum = Number(aggregate[re.gear].sum) + Number(re.speed)
    aggregate[re.gear].count = Number(aggregate[re.gear].count) + 1 
  });

  let aggr_data = []

  let gears = ["Park", "Reverse", "1st Gear", "2nd Gear", "3rd Gear", "4th Gear", "5th Gear", "6th Gear"]
  gears.forEach(g => {
    aggr_data.push({"gear":g, "avgspeed":(Number(aggregate[g].sum)/Number(aggregate[g].count))})
  })
  return aggr_data

}

const addRecord = function(reading){
  return new Promise(resolve =>{
    let readings_doc = firestore.doc("fsae_logger_a5/speed_logs")
    readings_doc.get().then(function(doc){
      let readings = doc.data().readings
      readings.push(reading)
      aggr = calculateAggr(readings)
      readings_doc.update({
        readings: readings,
        aggregate: aggr
      }).then(function(res){
        resolve(aggr);
      })
    })
  })
}

const updateRecord = function(new_readings){
  
  return new Promise(resolve =>{
    aggr = calculateAggr(new_readings)
    const doc = firestore.doc('fsae_logger_a5/speed_logs')
    doc.update({
      readings: new_readings,
      aggregate: aggr
    }).then(function(res){
      resolve(aggr);
    })
  })
}

const admin = require('firebase-admin');

let serviceAccount = require('./flash-rope-226620-43d7c73f4bd0.json')

const firebaseConfig = {
  credential: admin.credential.cert(serviceAccount),
  apiKey: "AIzaSyDd6U7dSDMGiuNLotmtGw8mVSnbzSUMH9o",
  authDomain: "flash-rope-226620.firebaseapp.com",
  databaseURL: "https://flash-rope-226620.firebaseio.com",
  projectId: "flash-rope-226620",
  storageBucket: "flash-rope-226620.appspot.com",
  messagingSenderId: "706881345421",
  appId: "1:706881345421:web:8566151d602516fa888fc4",
  measurementId: "G-36NDBBM640"
};

admin.initializeApp(firebaseConfig);

const firestore = admin.firestore();


