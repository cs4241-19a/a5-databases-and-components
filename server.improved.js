const http = require("http"),
    fs = require("fs"),
    mime = require("mime"),
    express = require("express"),
    app = express(),
    session = require("express-session"),
    passport = require("passport"),
    Local = require("passport-local").Strategy,
    bodyParser = require("body-parser"),
    cookieParser = require("cookie-parser"),
    helmet = require("helmet"),
    mongodb = require("mongodb"),
    dir = "public/",
    port = 3000;

const uri =
    "mongodb+srv://" +
    process.env.USER +
    ":" +
    process.env.PASS +
    "@" +
    process.env.HOST +
    "/" +
    process.env.DB;

const client = new mongodb.MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

let loginInfo = null;
let userData = null;

client
    .connect()
    .then(() => {
        // will only create collection if it doesn't exist
        return client.db("database").createCollection("loginInfo");
    })
    .then(__collection => {
        // store reference to collection
        loginInfo = __collection;
        // blank query returns all documents
        return loginInfo.find({}).toArray();
    })
    .then(console.log);

client
    .connect()
    .then(() => {
        // will only create collection if it doesn't exist
        return client.db("database").createCollection("userData");
    })
    .then(__collection => {
        // store reference to collection
        console.log("store reference");
        userData = __collection;
        // blank query returns all documents
        return userData.find({}).toArray();
    })
    .then(console.log);

app.use(express.static(dir));
app.use(helmet());
app.use(passport.initialize());
app.use(bodyParser.json());
app.use(cookieParser());

app.get("/", function(req, res) {
    // Cookies that have not been signed
    console.log("Cookies: ", req.cookies);

    // Cookies that have been signed
    console.log("Signed Cookies: ", req.signedCookies);
});

const myLocalStrategy = function(username, password, done) {
    let user;
    console.log("User " + username + " requested");
    loginInfo
        .find({ username: username })
        .toArray()
        .then(result => {
            user = result[0];
            console.log(user);
            if (user === undefined) {
                return done(null, false, { message: "user not found" });
            } else if (user.username === username && user.password === password) {
                return done(null, { username, password });
            } else {
                return done(null, false, { message: "incorrect password" });
            }
        });
};

passport.use("local-login", new Local(myLocalStrategy));

passport.initialize();

app.post("/login", passport.authenticate("local-login", {}), function(
    req,
    res
) {
    console.log("login works");
    res.redirect("/");
});

passport.serializeUser((user, done) => done(null, user.username));

passport.deserializeUser((username, done) => {
    let user;
    loginInfo
        .find({})
        .toArray()
        .then(result => {
            user = result[0];
            if (user !== undefined) {
                done(null, user);
            } else {
                done(null, false, { message: "user not found: session not restored" });
            }
        });
});

app.use(
    session({ secret: "cats cats cats", resave: false, saveUninitialized: false })
);
app.use(passport.initialize());
app.use(passport.session());

app.post("/test", function(req, res) {
    console.log("authenticate with cookie?", req.user);
    res.json({ status: "success" });
});

app.get("/studentData", (req, res) => {
    if (userData !== null) {
        userData
            .find({})
            .toArray()
            .then(result => res.json(result));
    }
});

app.get("/register", (req, res) => {
    if (loginInfo !== null) {
        loginInfo
            .find({})
            .toArray()
            .then(result => res.json(result));
    }
});

app.post("/register", (req, res) => {
    let data = req.body;
    console.log(data);
    loginInfo.insertOne(data);
    res.status(200).send("Added user to database");
});

app.post("/submit", function(req, res) {
    var data = req.body;
    switch (data.values) {
        case "bravery":
            data.house = "Gryffindor";
            break;
        case "loyalty":
            data.house = "Hufflepuff";
            break;
        case "wisdom":
            data.house = "Ravenclaw";
            break;
        case "ambition":
            data.house = "Slytherin";
            break;
        default:
            data.house = "Muggle";
    }
    userData.insertOne(data);
    res.status(200).send("Successfully added new character");
});

app.post("/update", function(req, res) {
    let data = req.body
    console.log("Old First Name " + data.oldFirstName)
    console.log("Old Last Name " + data.oldLastName)
    console.log("Old Pronouns " + data.oldPronouns)
    console.log("Old House " + data.oldHouse)
    userData.updateOne(
        {firstName: data.oldFirstName,
            lastName: data.oldLastName,
            pronouns: data.oldPronouns,
            house: data.oldHouse
        },
        {$set: {
                firstName: data.firstName,
                lastName: data.lastName,
                pronouns: data.pronouns,
                house: data.house
            }})

    let user
    userData
        .find({ firstName: data.firstName })
        .toArray()
        .then(result => {
            user = result[0];
            console.log(user);
        });

    res.status(200).send("updated");
});

app.post("/delete", function(req, res) {
    let data = req.body
    userData.deleteOne({
        firstName: data.firstName,
        lastName: data.lastName,
        pronouns: data.pronouns,
        house: data.house
    });
    res.status(200).send("deleted");
});

app.listen(process.env.PORT || port);
