var express = require('express');
var router = express.Router();

function dbUpdate(username, seat, date, time, id) {
    const Database = require('better-sqlite3');
    const db = new Database('bookings.db', {readonly: false});
  
    const stmt = db.prepare('UPDATE reservations SET username=?, seat=?, date=?, time=? WHERE id=?');
    stmt.run(username, seat, date, time, id);
}

router.post('/', function (req, res) {
    const username = req.body.username;
    const seat = req.body.seat;
    const date = req.body.date;
    const time = req.body.time;
    const id = req.body.id;

    dbUpdate(username, seat, date, time, id);
    res.redirect("/?alert=Booking+updated");
  })
  
module.exports = router;