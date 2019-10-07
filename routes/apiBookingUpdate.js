var express = require('express');
var router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

const Mongo = require('mongodb')
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGODB_URL;
const client = new MongoClient(uri, { useNewUrlParser: true });

function dbUpdate(username, seat, date, time, id, res) {
  client.connect(err => {
    const collection = client.db("reservations").collection("bookings");
      
    const querySelector = { _id: new Mongo.ObjectID(id) }
    const entry = { $set: { username: username, seat: seat, date: date, time: time } };

    collection.updateOne(querySelector, entry, function(err, obj) {
      if (err) throw err;
      console.log("Updated " + id);
      res.redirect("/?alert=Booking+updated");
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
    const id = req.body.id;

    dbUpdate(username, seat, date, time, id, res);
  })
  
module.exports = router;