var express = require('express');
var router = express.Router();

function dbDelete(id) {
    const Database = require('better-sqlite3');
    const db = new Database('bookings.db', {readonly: false});
  
    const stmt = db.prepare('DELETE FROM reservations WHERE id=?');
    stmt.run(id);
}

router.post('/', function (req, res) {
    const id = req.body.id;

    dbDelete(id);
    res.redirect("/?alert=Booking+deleted");
  })
  
module.exports = router;