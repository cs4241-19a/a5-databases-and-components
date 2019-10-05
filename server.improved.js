const bodyParser = require('body-parser'),
express = require('express'),
app = express(),
path = require('path'),
favicon = require('serve-favicon'),
serveStatic = require('serve-static'),
mongodb = require('mongodb'),
port = process.env.PORT || 3000;
const uri = process.env.URI

let money = 0,
speed = 0,
thetoken = "",
imageOrders = [],
orders = [];
app.use(favicon(path.join(__dirname,'public','assets','favicon.ico')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(serveStatic('public', { 'index': false}))

let collection = null
const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'scoreboard' ).createCollection( 'accounts' )
  })
  .then(_collection => {
  collection = _collection
    // blank query returns all documents
    return collection.find({}).toArray()
})



app.get('/', (req, res) => {
  res.redirect('/home')
})
app.get('/home', function(req, res) {
  let thepath = path.normalize(__dirname + '/public/html/home.html');
  res.sendFile(thepath);
})
app.get('/instructions', function(req, res) {
  let thepath = path.normalize(__dirname + '/public/html/instructions.html');
  res.sendFile(thepath);
})
app.get('/game', function(req, res) {
  let thepath = path.normalize(__dirname + '/public/html/game.html');
  res.sendFile(thepath);
})
app.get('/scoreboard', function(req, res) {
  let thepath = path.normalize(__dirname + '/public/html/scoreboard.html');
  res.sendFile(thepath);
})
app.post('/updateBank', function(req, res) {
  money += Number(req.body.amount);
  res.send({result: money});
})
app.post('/reset', function(req, res) {
  money = Number(req.body.amount);
  imageOrders = [];
  orders = [];
  res.send({result: money});
})
app.post('/neworder', function(req, res) {
  imageOrders.push(req.body.img);
  orders.push(req.body.order);
  res.send({images: imageOrders, orders: orders});
})
app.post('/remove', function(req, res) {
  let move = req.body.move;
  let kind = "";
  if(imageOrders[0].includes('vanilla')){
    if(move === 49){
      kind = "VN";
      imageOrders.splice(0, 1);
      orders.splice(0, 1);
    }else{
      kind = "WK";
    }
  }else if(imageOrders[0].includes('chocolate')){
    if(move === 50){
      kind = "CH";
      imageOrders.splice(0, 1);
      orders.splice(0, 1);
    }else{
      kind = "WK";
    }
  }else if(imageOrders[0].includes('strawberry')){
    if(move === 51){
      kind = "ST";
      imageOrders.splice(0, 1);
      orders.splice(0, 1);
    }else{
      kind = "WK";
    }
  }else if(imageOrders[0].includes('cookie')){
    if(move === 52){
      kind = "CD";
      imageOrders.splice(0, 1);
      orders.splice(0, 1);
    }else{
      kind = "WK";
    }
  }
  res.send({images: imageOrders, orders: orders, kind: kind});
})
app.post('/submit', function(req, res) {
  if(colection !== null){
    collection.updateOne({name:'entries'}, {$push: {'entries': req.body.entry}})
  }
})
app.post('/spendSpeed', function(req, res) {
  speed = req.body.speed;
})
app.get('/getSpeed', function(req, res) {
  res.send({speed: speed});
})
app.get('/loadscores', function(req, res) {
  if(collection !== null){
    collection.find({ }).toArray().then(result => {
      res.send({result: result[1].entries})
    })
  }
})
app.listen(port)
