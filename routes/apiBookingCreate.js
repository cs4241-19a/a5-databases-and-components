var express = require('express');
var router = express.Router();
const dotenv = require('dotenv');
dotenv.config();


const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGODB_URL;
const client = new MongoClient(uri, { useNewUrlParser: true });



function dbInsert(username, seat, date, time, userID, email) {
    client.connect(err => {
      const collection = client.db("reservations").collection("bookings");
      
      const entry = { username: username, seat: seat, date: date, time: time, userID: userID, email: email };
      collection.insertOne(entry, function(err, res) {
        if (err) throw err;
        console.log("1 record inserted");
        client.close();
      });
    
      client.close();
    });
}

router.post('/', function (req, res) {
    const username = req.body.username;
    const seat = req.body.seat;
    const date = req.body.date;
    const time = req.body.time;
    const userID = req.body.userid;
    const email = req.body.username + "@wpi.edu";

    dbInsert(username, seat, date, time, userID, email);

    res.redirect("/?alert=Saved");
  })
  
module.exports = router;