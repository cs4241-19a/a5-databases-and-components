var express = require('express');
var router = express.Router();
var passport = require('passport');
var app = require('../app');

router.post('/',
    passport.authenticate('local', {failureRedirect: '/' ,  failureFlash: true}),
    function(req,res){
        app.user = req.user;
        res.render('profile', { user: app.user.displayName });
    });

module.exports = router;
