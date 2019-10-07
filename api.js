var express = require('express');
var passport = require('passport');
var Strategy = require('passport-local')
var router = express.Router();
var db = require('./db');

passport.use(new Strategy((username, password, cb) => {
  const admin = db.get('admin').value();
  console.log(admin);
  if (admin.name === 'username' && admin.password === password) {
    return cb(null, admin);
  } else {
    cb(null, false);
  }
}));

/* GET users listing. */
router.get('/data', function(req, res, next) {
  res.json({
    users: db.get('users').value(),
    books: db.get('books').value(),
    list: db.get('borrowingList').value(),
  });
});

router.post('/login',
  passport.authenticate('local', { successRedirect: '/dashboard',
    failureRedirect: '/' }));

router.post('/user', function (req, res, next) {
  console.log(req.body);
  const userId = req.body.userId;
  const username = req.body.username;
  db.get('users').push({
    id: userId,
    name: username,
  });

  res.json({
    id: userId,
    name: username,
  });
});

router.post('/book', function (req, res, next) {
  const bookId = req.body.bookId;
  const bookname = req.body.bookname;
  db.get('books').push({
    id: bookId,
    name: bookname,
  });

  res.json({
    id: bookId,
    name: bookname,
  });
});

router.put('/relation', function(req, res, next) {
  const id = req.body.id;
  const userId = req.body.userId;
  const bookId = req.body.bookId;
  db.get('borrowingList').find({ id }).assign({
    id,
    userId,
    bookId,
  });
  res.json({});
});

router.delete('/relation', function (req, res, next) {
  const id = req.body.id;
  console.log(id);
  db.get('borrowingList').remove({
    id,
  }).write();
  res.json({});
});

module.exports = router;
