var express = require("express"),
 		app = express(),
		bodyParser = require("body-parser"),
		mongoose = require("mongoose"),
    flash = require("connect-flash"),
    passport = require("passport"),
    router = express.Router(),
    path = require('path'),
    LocalStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    Item = require("./models/item"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    seedDB = require("./seeds");

const port = 3000;

// Requiring routes
var commentRoutes = require("./routes/comments"),
    itemRoutes = require("./routes/items"),
    indexRoutes = require("./routes/index");

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/views/landing.html'));
  //__dirname : It will resolve to your project folder.
});
//var url = process.env.DATABASEURL || "mongodb://localhost/marketplace_beta";

var url = 'mongodb+srv://heartkiller:AsrSNmXn5dMpQgw@operation-mongoose-iyooo.mongodb.net/test?retryWrites=true&w=majority';
mongoose.connect(url, 
                 { 
                  useNewUrlParser: true, 
                  useCreateIndex: true 
                 }).then(() => {
                    console.log('Connected to DB!');
                 }).catch(err => {
                    console.log('ERROR: ', err.message);
                 });

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.locals.moment = require('moment');
app.use(flash());

// Add sample data to database
// seedDB();

// Passport Configuration
app.use(require("express-session")({
  secret: "This is a sample secret text for encoding",
  resave: false,
  saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Middleware to pass user and message data to each route
app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// Use the routes
app.use(indexRoutes);
app.use("/items", itemRoutes);
app.use("/items/:id/comments", commentRoutes);
app.listen(process.env.PORT || 3000, process.env.IP, () => {
	console.log("Server is listening on port ", process.env.PORT || 3000, "...");
});
