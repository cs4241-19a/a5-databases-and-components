const express   = require( 'express' ),
      app       = express(),
      session   = require( 'express-session' ),
      passport  = require( 'passport' ),
      Local     = require( 'passport-local' ).Strategy,
      bodyParser= require( 'body-parser' ),
      favicon = require('serve-favicon'),
      path = require('path'),
      serveStatic = require('serve-static'),
      mongodb = require( 'mongodb' )
      //uncapitalize = require('express-uncapitalize')


app.use( express.static('public') );
app.use( express.json() );

const uri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+'/'+process.env.DB

const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true })
let collection = null

client.connect()
  .then( () => {
    // will only create collection if it doesn't exist
    return client.db( 'Webware' ).createCollection( 'assignment-5-users' );
  })
  .then( __collection => {
    // store reference to collection
    collection = __collection;
    // blank query returns all documents
    return collection.find({ }).toArray();
  })
  .then(  );


app.use( (req,res,next) => {
  if( collection !== null ) {
    next()
  }else{
    res.status( 503 ).send()
  }
});

app.use( bodyParser.json());
app.use( session({ secret:'cats cats cats', resave:false, saveUninitialized:false }));
app.use( passport.initialize());
app.use( passport.session());
app.use(favicon('public/images/favicon.ico'));
app.use(serveStatic('public'));
//app.use(uncapitalize());


//the current user logged in
var currentUser;

//an array of the users, I don't know if I still use it but it's important
var allUsers = [];

//fills app data with the current data in the table
const fillAppData = async function(){
  //appdata = [];
  await collection.find({ }).toArray()
    .then(result => {
      appdata=[];
      result.forEach(function(user) {
        appdata.push(JSON.parse(JSON.stringify({username: user.username,fname : user.fname, lname:user.lname,birthday:user.birthday,color:user.color,mood:user.mood}))); // adds their info to the dbUsers value
      });
    });
}

//get the login page or results if logged in
app.get('/', function( req, res ) {
  if(isLoggedIn(req)){
    res.sendFile('views/results.html', {root: __dirname });
  } else {
    res.sendFile('views/login.html', {root: __dirname });
  }
});

//get the edit page if logged in
app.get('/edit', function( req, res ) {
  if(isLoggedIn(req)){
    res.sendFile('views/form.html', {root: __dirname });
  } else {
    res.sendFile('views/login.html', {root: __dirname });
  }
});

//get the favicon
app.get('/favicon', function(req,res){
  res.sendFile('public/images/favicon.ico',{root: __dirname });
});

//logs the user out and redirects to login
app.get("/logout", function (req, res) {  
  req.logout();
  res.redirect("/");
});
app.listen( process.env.PORT || 3000 )


//from notes
const myLocalStrategy = function( username, password, done ) {
  let user;
  collection.findOne({ username: username }).then(result => {
                                                             user = result;
                                                            if( user === null ) {
                                                                return done( null, false, { message:'user not found' })
                                                              }else if( user.password === password ) {
                                                                return done( null, { username, password })
                                                              }else{
                                                                return done( null, false, { message: 'incorrect password' })
                                                              }
                                                            });
}

passport.use( new Local( myLocalStrategy ) )
passport.initialize()

//login
app.post('/login', passport.authenticate( 'local' ), function( req, res ) {
    res.json({ status:true });
  }
);

//makes a new user
app.post('/createAccount', function(req, res){
  let prevUser;
  collection.findOne({username:req.body.username}).then(result=>{
    prevUser = result;
    if(prevUser === null){
      collection.insertOne( req.body ).then( result => { res.json( result );
                                                        res.writeHeader(200, { 'Content-Type': 'text/plain' });
                                                        res.end();})      
    } else {
      res.writeHeader(409, { 'Content-Type': 'text/plain' });
      res.end();
    }
  });  
});

//from notes
passport.serializeUser( ( user, done ) => done( null, user.username ) )

// from notes
passport.deserializeUser( ( username, done ) => {
  let user;
  currentUser = username;
  collection.findOne({ username: username }).then(result => {
    user = result;
    if( user !== undefined ) {
      done( null, user )
    }else{
      done( null, false, { message:'user not found; session not restored' })
    }
  });
});

//from notes
app.post('/test', function( req, res ) {
  res.json({ status:'success' })
})

//gets user info
app.get('/getResults',function(req,res){
  sendResults(res);
});

//gets group info
app.get('/getStuff',function(req,res){
  sendResults2(res);
});

//checks if user is logged in
const isLoggedIn = function(req){
  return (typeof req.user !== 'undefined');
}
 
//the app data (used for calculating group stats)  
var appdata=[];

//submits data
app.post('/submit', function(request,response){
    let dataString = ''

  request.on( 'data', function( data ) {
      dataString += data 
  })

  request.on( 'end', function() {

    var data = JSON.parse(dataString)
    appdata.push(data);
    
    var fname = data.fname;
    var lname = data.lname;
    var birthday = data.birthday;
    var color = data.color;
    var mood = data.mood;
    
    var yourname = fname+" "+lname;
    var yourage = getAge(birthday);
    var yourmood = getMood(mood);
    var colors = getRGB(color);
    var yourcolorR = colors[0];
    var yourcolorB = colors[2];
    var yourcolorG = colors[1];
    
    var avgnamelength = getAvgLength();
    var avgname = getAvgName();
    var avgage = getAvgAge();
    var avgcolor = getAvgColor();
    var avgmood = getAvgMood();
    
    //do stuff
    
    const responseJSON = {
      'fname': fname,
      'lname': lname,
      'birthday': birthday,
      'color': color,
      'mood': mood,
      'yourname': yourname,
      'yourage': yourage,
      'yourcolorR': yourcolorR,
      'yourcolorB': yourcolorB,
      'yourcolorG': yourcolorG,
      'yourmood': yourmood,
      'avgnamelength': avgnamelength,
      'avgname': avgname,
      'avgage': avgage,
      'avgcolor': avgcolor,
      'avgmood': avgmood
    }
    
    const responseData = JSON.stringify(responseJSON);
    

    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' });
    response.write(responseData);
    response.addTrailers({'Content-Type': 'application/json'});
    response.end();
  })})

//determines your age
const getAge = function(birthday){
  var today = new Date();
  var birthdate = new Date(birthday);
  var age = today.getFullYear() - birthdate.getFullYear();
  if (today.getMonth() < birthdate.getMonth() || (today.getMonth() == birthdate.getMonth() && today.getDate() < birthdate.getDay())) {
    age--;
  }
  return age;
}

//determines your mood
const getMood = function(mood){
  switch(mood){
    case "1":
      return "You are not having a good time :'^(";
    case "2":
      return "You are having a less than ideal time :(";
    case "3":
      return "You are having an ok time";
    case "4":
      return "You are having a pretty good time";
    case "5":
      return "You are having a fantastic time!";
  }
}


//calculates the rgb in a nice form
const getRGB = function(color){
  var r = "0x"+color.substring(1,3);
  var g = "0x"+color.substring(3,5);
  var b = "0x"+color.substring(5,7);
  var r1 = parseInt(r) / 255.0 * 100;
  var g1 = parseInt(g) / 255.0 * 100;
  var b1 = parseInt(b) / 255.0 * 100;
  return [r1.toFixed(2),g1.toFixed(2),b1.toFixed(2)];
}

//gets rgb not in a nice string form
const getRGB2 = function(color){
  if(color != undefined){
  var r = "0x"+color.substring(1,3);
  var g = "0x"+color.substring(3,5);
  var b = "0x"+color.substring(5,7);
  var r1 = parseInt(r);
  var g1 = parseInt(g);
  var b1 = parseInt(b);
  return [r1,g1,b1];
  }
}

//calculates average name
const getAvgName = function(){
  var avgfname = getAvgFnameLength();
  var avglname = getAvgLnameLength();
  var fname = [];
  var lname = [];
  for(var i=0;i<avgfname;i++){
    fname[i]=0;
  }
  for(var i=0;i<avglname;i++){
    lname[i]=0;
  }
  for(var i=0;i<appdata.length;i++){
    if(appdata[i].fname != undefined && appdata[i].lname!=undefined){
    var names = [appdata[i].fname.toUpperCase(), appdata[i].lname.toUpperCase()];
    for(var j=0;j<avgfname;j++){
      if(j > names[0].length-1){
        fname[j]+="A".charCodeAt(0);
      }else{
        fname[j]+=names[0].charCodeAt(j);
      }      
    }
    for(var j=0;j<avglname;j++){
      if(j > names[1].length-1){
        lname[j]+="A".charCodeAt(0);
      }else{
        lname[j]+=names[1].charCodeAt(j);
      }      
    }
    }
  }
  var name="";
  for(var i=0;i<avgfname;i++){
    fname[i]=fname[i]/appdata.length;
    name+=String.fromCharCode(fname[i]);
  }
  name+=" ";
  for(var i=0;i<avglname;i++){
    lname[i]=lname[i]/appdata.length;
    name+=String.fromCharCode(lname[i]);
  }
  return name;
}

//calculates average first name length
const getAvgFnameLength = function(){
  var chars = 0;
  for(var i=0;i<appdata.length;i++){
    if(appdata[i].fname != undefined)
      chars+=appdata[i].fname.length;
  }
  var avgchars = chars/appdata.length;
  return avgchars;
}

//calculates average last name length
const getAvgLnameLength = function(){
  var chars = 0;
  for(var i=0;i<appdata.length;i++){
    if(appdata[i].lname != undefined)
      chars+=appdata[i].lname.length;
  }
  var avgchars = chars/appdata.length;
  return avgchars;
}

//calculates average name length
const getAvgLength = function(){
  var chars = 0;
  for(var i=0;i<appdata.length;i++){
    if(appdata[i].fname != undefined && appdata[i].lname != undefined)
      chars+=appdata[i].fname.length + appdata[i].lname.length;
  }
  var avgchars = chars/appdata.length;
  return avgchars;
}

//calculates average age
const getAvgAge = function(){
  var age=0;
  for(var i=0;i<appdata.length;i++){
    age+=getAge(appdata[i].birthday);
  }
  age = age/appdata.length;
  return age;
}

//calculates average color
const getAvgColor = function(){
  var r = 0;
  var g = 0;
  var b = 0;
  for(var i=0;i<appdata.length;i++){
    var colors = getRGB2(appdata[i].color);
    if(colors!=undefined){
    r += colors[0];
    g += colors[1];
    b += colors[2];
    }
  }
  var r1 = r / appdata.length;
  var g1 = g / appdata.length;
  var b1 = b / appdata.length;
  r1 = parseFloat(r1.toFixed(0));
  g1 = parseFloat(g1.toFixed(0));
  b1 = parseFloat(b1.toFixed(0));
  var final = r1.toString(16)+g1.toString(16)+b1.toString(16);
  switch(final.length){
    case 3:
      final = "#000"+final;
      break;
    case 4:
      final = "#00"+final;
      break;
    case 5:
      final = "#0"+final;
      break;
    default:
      final = "#" + final;
      break;
  }
  return final;
}

//calculates average mood
const getAvgMood = function(){
  var mood=0;
  for(var i=0;i<appdata.length;i++){
    mood+=parseInt(appdata[i].mood);
  }
  mood = mood/appdata.length;  
  return mood;
}

//sends the user results
const sendResults = async function(response){
  await fillAppData();
  
  let results = JSON.stringify(appdata);
  
  for(var i=0;i<appdata.length;i++){
    if(appdata[i].username === currentUser){
      results = JSON.stringify(appdata[i]);
    }else{
    }  
  }
  /*if(currentUser === "admin"){
    results = JSON.stringify(appdata);
  }*/
  
  response.writeHeader(200, {'Content-Type': 'plain/text'});
  response.write(results);
  response.addTrailers({'Content-Type': 'application/json'});
  response.end();
}

//sends group results
const sendResults2 = async function(response){
  await fillAppData();
  var avgnamelength = getAvgLength();
    var avgname = getAvgName();
    var avgage = getAvgAge();
    var avgcolor = getAvgColor();
    var avgmood = getAvgMood();
  var totalUsers = appdata.length;
    
    //do stuff
    
    const responseJSON = {
      'avgnamelength': avgnamelength,
      'avgname': avgname,
      'avgage': avgage,
      'avgcolor': avgcolor,
      'avgmood': avgmood,
      'totalUsers': totalUsers
    }
    
    const responseData = JSON.stringify(responseJSON);


    response.writeHead( 200, "OK", {'Content-Type': 'text/plain' });
    response.write(responseData);
    response.addTrailers({'Content-Type': 'application/json'});
    response.end();
}

//function for editing a user's input
app.post('/update',function(request,response){
    collection.updateOne({ username:currentUser},
                         { $set:{ fname:request.body.fname,
                                  lname: request.body.lname,
                                  color: request.body.color,
                                  birthday: request.body.birthday,
                                  mood: request.body.mood} }).then( result => {response.json( result );
                                                                               response.writeHeader(200, { 'Content-Type': 'text/plain' });
                                                                               response.end();});
  });



//fills the edit form
app.get('/formstuff', function(request,response){
  sendResults(response);
});