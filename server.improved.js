require("dotenv").config();
const mongoose = require("mongoose"),
  express = require("express"),
  app = express(),
  bcrypt = require("bcrypt"),
  passport = require("passport"),
  passportLocal = require("passport-local"),
  LocalStrategy = passportLocal.Strategy,
  flash = require("express-flash"),
  session = require("express-session"),
  morgan = require("morgan"),
  helmet = require("helmet"),
  // users = [],
  appdata = [];

// app.use(morgan("common"));

// Passport config
require('./config/passport')(passport);

// DB config
const db = require("./config/keys").MongoURI;
const User = require("./models/User");

// Connect ot Mongo
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("MongoDB connected..."))
  .catch(err => console.log(err));

// automatically deliver all files in the public folder
// with the correct headers / MIME type.
app.use(express.static("public"));

app.set("view-engine", "ejs");

// Bodyparser middleware
app.use(express.urlencoded({ extended: false }));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false, // don't resave our env variables if nothings changed
    saveUninitialized: false
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash middleware
app.use(flash());

app.get("/", checkAuth, function(request, response) {
  response.render(__dirname + "/public/views/index.ejs", {
    name: request.user.name
  });
});

// Get routes for views
app.get("/login", checkNotAuth, function(request, response) {
  response.render(__dirname + "/public/views/login.ejs");
});

app.post(
  "/login",
  checkNotAuth,
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
  })
);

app.get("/register", checkNotAuth, function(request, response) {
  response.render(__dirname + "/public/views/register.ejs");
});

app.post("/register", checkNotAuth, async function(request, response) {
  const { name, email, password, password2 } = request.body;
  try {
    // Validation that the email being sent to to the database is unique
    User.findOne({ email: email })
      .then(user => {
        if (user) {
          console.log("Email already exists!");
          response.redirect("/register");
        } else {
          const newUser = new User({
            name,
            email,
            password
          });

          // Hash password
          bcrypt.genSalt(10, (err, salt) =>
            bcrypt.hash(newUser.password, salt, (err, hash) => {
              if (err) throw err;
              // Set password to hashed
              newUser.password = hash;
              // Save user
              console.log(newUser);
              newUser
                .save()
                .then(user => {
                  console.log("Successfully saved user to database");
                  response.redirect("/login");
                })
                .catch(err => console.log(err));
            })
          );
        }
      })
      .catch(err => console.log(err));
  } catch (error) {
    response.redirect("/register");
  }
});

app.post("/logout", function(request, response, next) {
  request.logout();
  response.redirect("/login");
});

function checkAuth(request, response, next) {
  if (request.isAuthenticated()) {
    return next();
  }
  response.redirect("/login");
}

function checkNotAuth(request, response, next) {
  if (request.isAuthenticated()) {
    return response.redirect("/");
  }
  next();
}


const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
