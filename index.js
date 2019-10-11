const express = require('express')
var bodyParser = require('body-parser');
const path = require('path')
const cool = require('cool-ascii-faces')
const PORT = process.env.PORT || 5000
const mongodb = require('mongodb');
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));

express()
  .use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
  .get('/', (req, res) => res.render('pages/index'))
  .get('/cool', (req, res) => res.send(cool()))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

//const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://kandonie:password123456@cluster0-7w27d.mongodb.net/admin?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// client.connect(err => {
//  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
//  client.close();
//});

app.get('/index', function(request, response) {
  response.sendFile(__dirname + '/views/pages/index.html');
});
