const express = require('express');
const router = express.Router();
const { shallNotPass, shallPass } = require('../config/auth');
const User = require('../models/user');

// Index page with Login and Register buttons
router.get('/', shallPass, (req, res) => res.render('index'));

// Login page when user inputs registered credentials
router.get('/home', shallNotPass, (req, res) => res.render('home', { user: req.user }));

router.post('/home/list', function(req, res, next) {
  console.log(req.body);
  let user = User.findById(req.user._id);
  user.findOneAndUpdate({_id: req.user._id}, {$push: {watchlist: req.body}}, {upsert: true},function(err, main) {
        res.redirect('/home');
  });
});

router.post('/home/delete/(:id)', (req, res, next) => {
  console.log(req.params);
  let id = req.params.id;
  let user = User.findById(req.user._id);
  user.update({_id: req.user._id}, {$pull: {watchlist: {_id: id}}}, {upsert: true},function(err, main) {
        res.redirect('/home');
  });
});

module.exports = router;