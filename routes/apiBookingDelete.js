var express = require('express');
var router = express.Router();
const dotenv = require('dotenv');
dotenv.config();

const Mongo = require('mongodb')
const MongoClient = require('mongodb').MongoClient;
const uri = process.env.MONGODB_URL;
const client = new MongoClient(uri, { useNewUrlParser: true });

function dbDelete(id, res) {
  client.connect(err => {
    const collection = client.db("reservations").collection("bookings");
      
    const querySelector = { _id: new Mongo.ObjectID(id) }

    collection.deleteOne(querySelector, function(err, obj) {
      if (err) throw err;
      console.log("Deleted " + id);
      res.redirect("/?alert=Booking+deleted");
      client.close();
    });
    
    client.close();
    });
}

router.post('/', function (req, res) {
    const id = req.body.id;

    dbDelete(id, res);
  })
  
module.exports = router;