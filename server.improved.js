let currentID; //this will keep track of who is signed in 
let userData;
let productData;
let objectID;

const http = require( 'http' ),
      fs   = require( 'fs' ),
      express = require('express'),
      bodyParser = require('body-parser'),
      mongodb = require('mongodb'),
      app = express(),
      session = require('express-session'),

      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000


app.use(express.static("public"));
app.use(session({ secret: "secretsInTheSky", resave: false,
  saveUninitialized: true,
  cookie: { secure: true } }));
app.use( bodyParser.json() );


const uri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+'/'+process.env.DB

const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collection = null;
let productList = null;

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'users' ).createCollection( 'accounts' )
  })
  .then( __collection => {
    // store reference to collection
    collection = __collection
    // blank query returns all documents
    //return collection.find({ }).toArray()
  })
  //.then( console.log )
  //.catch(err=>console.log(err))


client.connect().then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'users' ).createCollection( 'products' )
  })
  .then( __collection => {
    // store reference to collection
    productList = __collection
    
    // blank query returns all documents
    //return productList.find({ }).toArray()
  })
  //.then( console.log )
  //.catch(err=>console.log(err))


const createUserData = async function(){

  await collection.find({}).toArray()
    .then(result => {
      userData=[];
      result.forEach(function(user) {
        userData.push(JSON.parse(JSON.stringify({id: user._id,
                                                firstName : user.firstName, 
                                                lastName:user.lastName,
                                                username: user.username,
                                                password:user.password
                                                }))) 
      })
    })
}

const createProductData = async function(){

  await productList.find({}).toArray()
    .then(result => {
      productData=[];
      result.forEach(function(product) {
        productData.push(JSON.parse(JSON.stringify({id:product._id,
                                                    accountID: product.accountID,
                                                    productName: product.productName,
                                                    numProducts: product.numProducts,
                                                    price: product.price
                                                    })))
      })
    })
}


const updateProductData = async function(productID,num){
  await productList.updateOne({ _id:mongodb.ObjectID(productID)},//id needs to be the products unique ID
                             { $set: { numProducts: num } }) 
}

const deleteProductData = async function(productID,productName){
  await productList.deleteOne({ _id:mongodb.ObjectID(productID) })
}


app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
})

app.post('/createAccount', function(req,res){
  
  let inputData = ""; 
  currentID = undefined; //this is to restart the CurrentID in use so that a new one can be added later
  req.on( 'data', function( data ) {
    inputData = JSON.parse( data);
    
  })
  
  req.on( 'end', function() {
    
    collection.insertOne({
                      "firstName": inputData.firstName,
                      "lastName": inputData.lastName,
                      "username": inputData.username,
                      "password": inputData.password
                      })

  })
  res.send(JSON.stringify(inputData))
})

app.get('/', function(request, response) {
  sendFile( response, 'public/index.html' )
}); 

app.post('/submit', function(request, response) {
  handlePost( request, response )
})

app.delete('/delete', function(request,response){
  handleDelete(request,response)
})

app.get('/getrequest', function(request,response){
  handleGet(request,response)
})

app.post('/login', function(request,response){
  //response.send('POST request to homepage');
  verify(request,response)
})


const verify = async function(request,response){
  await createUserData();
  let inputData = ""; 
  request.on( 'data', function( data ) {
    inputData = JSON.parse( data);
    
  })
  
  request.on( 'end', function() {
    let uname = inputData.username
    let pass = inputData.password
    
    let unameCheck = userData.filter(x => x.username===uname) //checks if username exists
    let passwordCheck = unameCheck.filter(x=> x.password ===pass) //checks if username and password combo exists using the array created by finding the username
    
    if (passwordCheck.length === 0){ //if username does not exist or password is incorrect, this array will have length of 0 
      response.send({message:"User or password not found"})
    }else{
      response.send({message:"User and Password matched"})
      currentID = passwordCheck[0].id
      //console.log(currentID)
    }    
  })
}



const handleGet = function( request, response ) {
  const filename = dir + request.url.slice( 1 ) 

  if( request.url === '/' ) {
    sendFile( response, 'public/index.html' )
    
  }else if (request.url === '/getrequest'){ 
    handleGetRequest(request, response) 
  } 
  else{
    sendFile( response, filename )
  }
}

const handlePost = function( request, response ) {
  let inputData = ""; 
  request.on( 'data', function( data ) {
    inputData = JSON.parse( data);
    
  })
  
  request.on( 'end', async function() {
    if(currentID === undefined){
      await createUserData();
      let newUserID = userData.slice(-1)[0].id //gets the newly created userID
      currentID = newUserID
      //console.log("post request: "+currentID)
      productList.insertOne({
                        accountID: currentID,
                        productName: inputData.productName,
                        numProducts: inputData.numProducts,
                        price: inputData.price
                        })
    }
    else{
      productList.insertOne({
                        accountID: currentID,
                        productName: inputData.productName,
                        numProducts: inputData.numProducts,
                        price: inputData.price
                        })
      //console.log("post request using currentID: "+currentID)
    }
  })
  response.send(JSON.stringify(inputData) )
}

const handleGetRequest = async function( request, response ) { 
  
  await createProductData();
  request.on( 'data', function( data ) {
  })

  //uses a similar method to the verify function, need to match the currentID to accountID
  //this will then display all the user's products in his list
  request.on( 'end', async function() { 
    if(currentID === undefined){
      await createUserData();
      let newUserID = userData.slice(-1)[0].id //gets the newly created userID
      currentID = newUserID 
      let newProductList = productData.filter(x => x.accountID===currentID)
      //console.log(currentID)
      //console.log(newProductList)
      response.send(newProductList)
      //console.log('New userID was created for the new registering Account')
       }
    else{
      let currentProductList = productData.filter(x => x.accountID===currentID)
      //console.log(currentID)
      //console.log('An existing userID was used')
      //console.log(currentProductList)
      response.send(currentProductList)
       } 
  })
}


//this will use updateOne and deleteOne in mongoDB
//if input makes numproduct greater than zero, use updateOne
//if input mkaes numproduct less than or equal to zero, use deleteOne

const handleDelete = async function( request, response ) {
  
  await createProductData();
  let dataVar ={}
    
  request.on( 'data', function( data ) {
    dataVar = JSON.parse( data);
    
  })
  
  request.on( 'end', async function() {
    
    let currentProductList = productData.filter(x => x.accountID===currentID)
    let exactProduct = currentProductList.filter(x =>x.productName === dataVar.productName)//only one product
    let numProd = parseInt(exactProduct[0].numProducts) //made into a number because it is originally a string
    let inputNumProd = parseInt(dataVar.numProducts)
    
    //update the number of products in the user's list if the quantity in the list is greater than the inputted value
    if(numProd > inputNumProd){ 
      numProd = numProd - inputNumProd
      objectID = exactProduct[0].id
      //console.log(objectID)
      await updateProductData(objectID,numProd);
      
       }
    //if the input is greater than or equal to the quantity stored than delete the whole entry/product
    else if (numProd <= inputNumProd){
      objectID = exactProduct[0].id
      await deleteProductData(objectID);
       }
    response.send(dataVar)
  })
  
}


const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we've loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHeader( 200, { 'Content-Type': type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( '404 Error: File Not Found' )

     }
   })
}

app.listen(process.env.PORT || port)
