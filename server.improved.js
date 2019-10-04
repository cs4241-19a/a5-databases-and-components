const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://jjscherick:test@cluster0-imj8y.mongodb.net/admin?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });

const http = require("http"),
  fs = require("fs"),
  mime = require("mime"),
  dir = "public/",
  passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy,
  express = require("express"),
  app = express(),
  responseTime = require("response-time");

app.use(require("morgan")("combined"));
app.use(require("body-parser").urlencoded({ extended: true }));
app.use(
  require("express-session")({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false
  })
);
app.use(require("express-uncapitalize")());
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  fs.readFile("public/loginDetails.json", function(err, content) {
    if (err === null) {
      let Users = JSON.parse(content);
      let user = Users.find(function(element) {
        return element.id == id;
      });
      cb(null, user);
    }
  });
});
passport.use(
  new LocalStrategy(function(username, password, done) {
    fs.readFile("public/loginDetails.json", function(err, content) {
      if (err === null) {
        let data = JSON.parse(content);
        let user = data.find(function(element) {
          return element.username == username;
        });
        if (!user) {
          let randID = Math.floor(Math.random() * 999 + 1);
          while (
            data.find(function(element) {
              return element.id == randID;
            })
          ) {
            randID = Math.floor(Math.random() * 999 + 1);
          }
          let user = { username: username, password: password, id: randID };
          data.push(user);
          fs.writeFile(
            "public/loginDetails.json",
            JSON.stringify(data),
            err => {
              if (err) throw err;
            }
          );
          return done(null, user);
        } else {
          if (user.password == password) {
            return done(null, user);
          } else {
            return done(null, false, {
              message: "username or password not found"
            });
          }
        }
      }
    });
  })
);

app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/error" }),
  function(req, res) {
    res.redirect("/");
  }
);

app.get("/error", function(req, res) {
  res.send("username or password was incorrect");
});

app.get("/", require("connect-ensure-login").ensureLoggedIn(), function(
  req,
  res
) {
  sendFile(res, "public/index.html");
  return;
});
app.get("/login", function(req, res) {
  sendFile(res, "public/login.html");
});
app.get("/getfoods", function(req, res) {
  getFood(req, res);
});
app.post("/submit", function(req, res) {
  console.log("hello");
  handlePost(req, res);
});
app.post("/edit", function(req, res) {
  handleEdit(req, res);
});
app.post("/deleteall", function(req, res) {
  handleDeleteAll(req, res);
});
app.post("/deletefood", function(req, res) {
  handleDelete(req, res);
});

async function handleDeleteAll(request, response) {
  let dataString = "";
  request.on("data", function(data) {
    dataString += data;
  });
  let data = await getData();
  data[request.user.username] = [];
  await updateData(data);
  response.writeHead(200, "OK", { "Content-Type": "text/plain" });
  response.end();
};
async function handleDelete(request, response) {
  let dataString = "";
  request.on("data", function(data) {
    dataString += data;
  });
  let data = await getData();
  let index = JSON.parse(dataString).delete;
  data[request.user.username].splice(index, 1);
  await updateData(data);
  response.writeHead(200, "OK", { "Content-Type": "text/plain" });
  response.end();
};

async function handleEdit(request, response) {
  let dataString = "";
  request.on("data", function(data) {
    dataString += data;
  });
  let data = await getData();
  let newData = JSON.parse(dataString);
        newData.CalPerWeek = newData.ammount * newData.cal;
        let newerData = {
          food: newData.food,
          ammount: newData.ammount,
          cal: newData.cal,
          CalPerWeek: newData.CalPerWeek,
          bad: newData.bad
        };
  data[request.user.username][newData.index] = newerData;
  await updateData(data);
  response.writeHead(200, "OK", { "Content-Type": "text/plain" });
  response.end();
}

async function handlePost(request, response) {
  let dataString = "";
  request.on("data", function(data) {
    dataString += data;
  });
  let data = await getData();
  let newData = JSON.parse(dataString);
  newData.CalPerWeek = newData.ammount * newData.cal;
  data[request.user.username].push(newData);
  await updateData(data);
  response.writeHead(200, "OK", { "Content-Type": "text/plain" });
  response.end();
}

const sendFile = function(response, filename) {
  const type = mime.getType(filename);
  fs.readFile(filename, function(err, content) {
    if (err === null) {
      response.writeHeader(200, { "Content-Type": type });
      response.end(content);
    } else {
      response.writeHeader(404);
      response.end("404 Error: File Not Found");
    }
  });
};

async function getFood(request, response) {
  const type = mime.getType("public/data.json");
  console.log("hello");
  let res = "<center><p>hello " + (request.user && request.user.username ? request.user.username : "undefined") + "</p>";
  let data = await getData();
  if (!data.hasOwnProperty(request.user.username)) {
    data[request.user.username] = [];
    res += "<p>This is the first time you are using this account so a new table has been created :)</p>";
    await updateData(data);
  }
  res += "<table class='pure-table' id='table'><tr><th>Food</th><th>Calories</th><th>Amout Eaten Per Week</th><th>Calories Per Week</th><th>Is Bad For You</th><th>Delete Food</th><th>Edit Food</th></tr>";
  let i = 0;
  let userData = data[request.user.username];
      userData.forEach(function(d) {
        res +=
          "<tr><td>" +
          d.food +
          "</td><td>" +
          d.cal +
          "</td><td>" +
          d.ammount +
          "</td><td>" +
          d.CalPerWeek +
          "</td><td>" +
          d.bad +
          "</td><td><button class='pure-button' onclick='del(" +
          i +
          ")''>Delete Food</button></td><td><button class='pure-button' onclick='editFood(" +
          i +
          ")''>Edit Food</button></td></tr>";
        i++;
      });
      res += "</table></center>";
  response.writeHead(200, { "Content-Type": "text/html" });
  response.end(res);
};

app.listen(3000, function() {
  console.log("Ready");
});


async function getData() { 
    const db = await MongoClient.connect(uri);
    const dbo = db.db("Data");
    const result = await dbo.collection("DataCollection").findOne({});
    console.log("result is " + JSON.stringify(result));
    return result;
}

async function updateData(data){
  let newData = {$set: data};
  await client.connect(err => {
    const collection = client.db("Data").collection("DataCollection");
    var query = { id: 0 };
    collection.updateOne(query, newData, function(err, res) {
      if (err) throw err;
      console.log("1 document updated");
    });
  });
}