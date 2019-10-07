var express = require('express');
var router = express.Router();

function dbDump() {
    const Database = require('better-sqlite3');
    const db = new Database('bookings.db', {readonly: false});
 
    const stmt = db.prepare('SELECT * FROM reservations');
    
    return stmt.all();
}

const allResults = dbDump();

console.log(allResults);

/* GET dump page. */
router.get('/', function(req, res, next) {
  res.render('dump', {allResults: allResults});
});

module.exports = router;
