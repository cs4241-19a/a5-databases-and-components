const mongodb = require( 'mongodb' ),
    express = require('express'),
    app = express(),
    low = require('lowdb'),
    FileSync = require('lowdb/adapters/FileSync'),
    adapter = new FileSync('data/db2.json'),
    db = low(adapter),
    passport = require('passport'),
    Local = require('passport-local').Strategy,
    session = require('express-session'),
    bodyparser = require('body-parser'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    path = require('path'),
    helmet = require('helmet'),
    router = express.Router(),
    compression = require('compression'),
    dir='public/',
    port = 8000;



//pasted stuff from his notes
const uri = "mongodb+srv://admin:gimme100PLZ@cs4241-a5-r0win.azure.mongodb.net/mineem?retryWrites=true&w=majority";
//const uri = 'mongodb+srv://'+process.env.USER+':'+process.env.PASS+'@'+process.env.HOST+'/'+process.env.DB;
const MongoClient = require('mongodb').MongoClient;
const client = new mongodb.MongoClient( uri, { useNewUrlParser: true, useUnifiedTopology:true });
let collectionUsers = null;
let collectionItems=NULL;

client.connect()
    .then( () => {
        // will only create collection if it doesn't exist
        return client.db( 'mineem' ).createCollection( 'items' )
    })
    .then( __collection => {
        // store reference to collection
        collectionUsers = __collection;
        // blank query returns all documents
      //  return collection.find({ }).toArray()
    });
    //.then( console.log );

client.connect()
    .then( () => {
        // will only create collection if it doesn't exist
        return client.db( 'mineem' ).createCollection( 'users' )
    })
    .then( __collection => {
        // store reference to collection
        collectionItems = __collection;
        // blank query returns all documents
       // return collection.find({ }).toArray()
    });
//    .then( console.log );


app.use( (req,res,next) => {
    if( collectionUsers !== null && collectionItems !== null) {
        next()
    }else {
        res.status( 503 ).send()
    }
});




const appdata = [
        {   "user":"admin",
            "itemName": "Son & Park Beauty Water",
            "category": "Health & Beauty",
            "list": "need",
            "oneRetailerOnly": "Yes",
            "URL": "https://seph.me/2kxrFgd"
        },
        {   "user":"admin",
            "itemName": "Givenchy Small GV3 Leather Shoulder Bag",
            "category": "Clothes & Handbags",
            "list": "want",
            "oneRetailerOnly": "No",
            "URL": "http://bit.ly/2md33JW"
        },
        {   "user":"admin",
            "itemName": "Lenovo Legion Y740",
            "category": "Electronics & Computers",
            "list": "want",
            "oneRetailerOnly": "No",
            "URL": "https://lnv.gy/2lRz8a3"
        },
        {   "user":"admin",
            "itemName": "Alienware Aurora R8 Desktop",
            "category": "Electronics & Computers",
            "list": "need",
            "oneRetailerOnly": "Yes",
            "URL": "https://dell.to/2mgSaHc"
        }
    ]
const users = [
    {username: 'swain', password: 'cain'},
    {username: 'eos7l', password: 'swdw'},
    {username:'admin', password: 'CS4241'}
]

db.defaults({appdata: appdata, users: users}).write();

// automatically deliver all files in the public folder
// with the correct headers / MIME type.
app.use(express.static(dir));
//app.use(cookieParser());
app.use(helmet());
app.use(compression());
app.use(bodyparser.json());
app.use(passport.initialize());

//passport.use( new Local( myLocalStrategy));
app.get('/', function (req, res) {
    // Cookies that have not been signed
    //console.log('Cookies: ', req.cookies);
    // Cookies that have been signed
    //console.log('Signed Cookies: ', req.signedCookies);
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

// app.get('/loggeduser', function (req, res) {
//     if (req.user === undefined) {
//         res.json({});
//     } else {
//         res.json({
//             username: req.user
//         });
//     }
// });

app.get('/main', function (req, res) {
    // Cookies that have not been signed
   // console.log('Cookies: ', req.cookies);
    // Cookies that have been signed
    //console.log('Signed Cookies: ', req.signedCookies);
    res.sendFile( path.join(__dirname, '/public/main.html'));
});

// all authentication requests in passwords assume that your client
// is submitting a field named "username" and field named "password".
// these are both passed as arugments to the authentication strategy.
const myLocalStrategy = function( username, password, done ) {
  // find the first item in our users array where the username
  // matches what was sent by the client. nicer to read/write than a for loop!
    let pass="";
    const user=collectionUsers.findOne({username:{$eq:username}})
        .then(user=>{
            if(user!=null){
                pass.user.password;
            }
            else {
                pass="";
            }
        });
//    await user;
//  const user = db.get('users').value().find( __user => __user.username === username );
  // if user is undefined, then there was no match for the submitted username
  if( user === undefined ) {
    /* arguments to done():
     - an error object (usually returned from database requests )
     - authentication status
     - a message / other data to send to client
*/
    return done( null, false, { message:'user not found' })
  }else if( pass === password ) {
    // we found the user and the password matches!
    // go ahead and send the userdata... this will appear as request.user
    // in all express middleware functions.
    return done( null, { username, password })
  }else{
    // we found the user but the password didn't match...
    return done( null, false, { message: 'incorrect password' })
  }
};

passport.use( 'local-login', new Local( myLocalStrategy ) );
passport.initialize();


app.post('/login',
    passport.authenticate( 'local-login',{
       // successRedirect: '/main',
         //failureRedirect: "/"
    } ),
    function( req, res ) {
        console.log( 'user:', req.user );
        res.json({ status: true });
    }
);

passport.serializeUser( ( user, done ) => done( null, user.username ) );
// "name" below refers to whatever piece of info is serialized in seralize User,
// in this example we're using the username
passport.deserializeUser( ( username, done ) => {
  const user = users.find( u => u.username === username );
  console.log( 'deserializing:', name );

  if( user !== undefined ) {
    done( null, user )
  }else{
    done( null, false, { message:'user not found; session not restored' })
  }
});
app.use( session({ secret:'topSecret', resave:false, saveUninitialized:false }) );
app.use( passport.initialize() );
app.use( passport.session() );

// app.post('/test', function( req, res ) {
//   console.log( 'authenticate with cookie?', req.user );
//   res.json({ status:'success' })
// });

app.post('/newData', (req, res) => {
    console.log(req.body);
    let data = db.get('appdata').filter({ user:req.body.user }).value();
    console.log(data);
    res.send(data);
});

app.get('/register', (req, res) => {
    let data = db.get('users').value();
    res.send(data)
});

app.post('/register', (req, res) => {
    let data = req.body;
    db.get('users').push(data).write();
    res.status(200).send("Added user to database");
});

app.post('/submit', function (req, res) {
    let data = req.body;
    const pushData={
        'user':data.user,
        'itemName': data.itemName,
        'category': data.category,
        'list': data.list,
        'oneRetailerOnly':data.oneRetailerOnly,
        'URL': data.URL,
    };
    db.get('appdata').push(pushData).write();
    res.status(200).send("pushed!");
});

app.post("/subumit",funnction(reqres){
    let data=req.body;
    collectionItems.insertOne({
        user:data.user,
    })
})




/*
app.post('/submit', function (req, res) {
    if(req.user===undefined){
        res.redirect(401,'/')
    }
    else{
        let curUser=req.user.username;
        let data=req.body;
        db.find({ 'user': curUser }).get('appdata').push(data).write();
        res.status(200).send("pushed!");
    }
});*/

app.post('/update', function (req, res) {
    const index = req.body.index,
        indexVal = db.get('appdata[' + index + ']').value();
    db.get('appdata').find(indexVal).assign({
        itemName: req.body.itemName,
        category: req.body.category,
        list: req.body.list,
        oneRetailerOnly: req.body.oneRetailerOnly,
        URL: req.body.URL
    }).write();
    res.status(200).send("updated!")
})

app.post('/delete', function (req, res) {
    const index = req.body.deletedData,
        indexVal = db.get('appdata[' + index + ']').value();
    db.get('appdata').remove(indexVal).write();
    res.status(200).send("deleted!")
})


app.listen(process.env.PORT || port);