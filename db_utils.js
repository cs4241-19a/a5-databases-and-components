const mongo = require('mongodb');
const pwd = require('pwd');
const moment = require('moment');

const connection_url = "mongodb://localhost:27017";
const db_name = "ChronusContinuum";
let db = null;

const init_db = async function(){
  const client = mongo.MongoClient(connection_url);
  return new Promise((resolve) => {
      client.connect(function(err) {
      console.log(err);
      console.log("Connected");
      db = client.db(db_name);
      resolve();
    })
  });
}

/*
user {
  username,
  hash,
  salt,
  clocks: [
    {
      title,
      moment
    }
  ]
}
*/


/**
 * Finds the document that is the user object
 * @param {String} user string username for User
 * @returns {Promise} promise from MongoDB that will turn into a User object
 */
const fetch_user = function(user){
  return db.collection('users').findOne({'username': user});
}

/**
 * @returns Promise that will resolve when the new user
 * is stored in the db
 * @param {string} name desired username
 * @param {string} pass unashed password
 */
const add_user = function(name, pass){
  // Hash the pass
  let user = {
    username: name,
    hash: null,
    salt: null,
    clocks: [],
  }
  // Wrapped in a promise to ensure that everything
  // finishes before continuing on.
  return new Promise((resolve) => {
    pwd.hash(pass)
    .then( result => {
      user.hash = result.hash;
      user.salt = result.salt;
    })
    .then(() => {
      // This is the tricky part, insterOne returns a promise.
      db.collection('users')
      .insertOne(user).then(result => {resolve(result);});
    })
  });
}


/**
 * Return a list of clock objects for given user
 */
const get_clocks = function(user){
  return new Promise((resolve) => {
    fetch_user(user).then(result => {
      resolve(result.clocks);
    });
  });
};


/**
 * Sets a clock with `title` for `username` with the zero point
 * at the `start` time.
 * @param {string} username the username
 * @param {string} title name of the clock
 * @param {moment} start a moment of the desired start time
 */
const add_clock = function(username, title, start=moment()){
  fetch_user(username).then(() => {
    db.collection('users').updateOne(
      {"username": username},
      {$push:
        {clocks: {
          title: title,
          zero_point: start.format(),
        }}
      }
    );
  });
}

/**
 * Resets a clock's zero_point and updates it in the DB
 * @param {User} user deserialized User object
 * @param {Int} index index of the clock to be reset
 */
const reset_clock = function(user, index){
  fetch_user(user.username).then(result => {
    result.clocks[index].zero_point = moment().format();
    db.collection('users').updateOne(
      {"username": result.username},
      {
        $set:{
          clocks: result.clocks,
        }
      });
  });
}

/**
 * Remove a clock from user object and update that object in the DB
 * @param {User} user deserialized User object
 * @param {Int} index index of the clock to be removed
 */
const delete_clock = function(user, index){
  let clocks = user.clocks;
  clocks.splice(index,1);
  db.collection('users').updateOne(
    {"username": user.username},
    {
      $set:{
        'clocks': clocks,
      }
    }
  );
}

module.exports = {db, add_clock, get_clocks, add_user, init_db, fetch_user, reset_clock, delete_clock};