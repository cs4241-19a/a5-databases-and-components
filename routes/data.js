var express = require('express');
var router = express.Router();
const low = require('lowdb');
var app = require('../app');
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('database.json');
const database = low(adapter);

router.get('/', function(req, res, next) {
    var userData = database.get(app.user.username);
    res.json(userData);
});

router.post('/add',
    function(req,res) {
        database.get(app.user.username)
        .push(req.body)
        .write();
        res.json(database.get(app.user.username));
    });

router.post('/edit',
    function(req,res) {
        database.get(app.user.username)
        .remove({"title":req.body.title})
        .write();
        database.get(app.user.username)
        .push(req.body.newEntry)
        .write();
        res.json(database.get(app.user.username))
    }); 

router.post('/delete',
    function(req,res) {
        database.get(app.user.username)
        .remove(req.body)
        .write();
        res.json(database.get(app.user.username));
    });   

module.exports = router;
