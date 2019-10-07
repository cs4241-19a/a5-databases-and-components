var express = require('express');
var router = express.Router();

function dbInsert(username, seat, date, time, userID, email) {
    const Database = require('better-sqlite3');
    const db = new Database('bookings.db', {readonly: false});
  
    const stmt = db.prepare('INSERT INTO reservations (username, seat, date, time, userID, email) VALUES (?, ?, ?, ?, ?, ?)');
    stmt.run(username, seat, date, time, userID, email);
}

function dbIsAvailable(seat, date, time) {
  const Database = require('better-sqlite3');
  const db = new Database('bookings.db', {readonly: false});

  const stmt = db.prepare('SELECT * FROM reservations WHERE seat=? AND date=? AND time=?');
  if (stmt.all(seat, date, time).length) {
    return false;
  }
  else {
    return true;
  }
}

router.post('/', function (req, res) {
    const username = req.body.username;
    const seat = req.body.seat;
    const date = req.body.date;
    const time = req.body.time;
    const userID = req.body.userid;
    const email = req.body.username + "@wpi.edu";
    
    if (dbIsAvailable(seat, date, time)) {
      dbInsert(username, seat, date, time, userID, email);
    }
    else {
      console.log("Collision!");
      res.redirect("/?alert=Sorry+that+seat+is+booked+for+that+time.+Try+a+new+seat.");
    }

    res.redirect("/?alert=Saved");
  })
  
module.exports = router;