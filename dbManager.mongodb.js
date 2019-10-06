const crypto = require('./crypto');
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://" + process.env.DB_USER + ":" + process.env.DB_PASS + "@entertainer-uatlz.mongodb.net/admin?retryWrites=true&w=majority";

const client = new MongoClient(url, {useNewUrlParser: true, useUnifiedTopology: true});

connectClient = function () {
    return new Promise(resolve => {
        if (client.isConnected()) resolve(client);
        else resolve(client.connect())
    })
};

DB = function () {
    return new Promise(resolve =>
        connectClient().then(client => resolve(client.db('Entertainer')))
    );
};

DB().then(db => {
    db.createCollection('content');
    db.createCollection('users');
});


ContentCollection = function () {
    return new Promise(resolve =>
        DB().then(db =>
            resolve(db.collection('content'))));
};

UsersCollection = function () {
    return new Promise(resolve =>
        DB().then(db =>
            resolve(db.collection('users'))));
};


exports.getAllContent = function () {
    return new Promise(resolve => {
        resolve(ContentCollection().then(collection => collection.find()));
    })
};

exports.getContentForUser = function (user) {
    return new Promise(resolve => {
        ContentCollection().then(collection => collection.find({username: user.username}).sort('type'));
    })
};

exports.addOrUpdateContent = function (user, type, text, id) {
    if (id === undefined || id === '') {
        console.log("Adding ", type, " for ", user.username, ": ", text);
        ContentCollection().then(collection => collection.insertOne({
            id: id,
            username: user.username,
            type: type,
            text: text
        }));
    } else {
        console.log('Updating content ', id);
        ContentCollection().then(collection => collection.updateOne({id: id}, {$set: {status: "D"}}));
    }
};

exports.deleteContent = function (user, contentID) {
    console.log("Delete: ", contentID);
    ContentCollection().then(collection => collection.delete({id: contentID}));
};

exports.checkPass = function (username, password) {
    return new Promise((resolve, reject) => {
        UsersCollection().then(collection => collection.findOne({username: username}).then(user => {
                console.log("CHECK PASS: Got user document for " + username + ": " + user);
                if (user !== undefined && crypto.compareString(user.password, password)) resolve(user);
                else reject();
            })
        );
    });
};

exports.getUser = function (username) {
    return new Promise((resolve, reject) => {
        UsersCollection().then(collection =>
            collection.findOne({username: username}).then(user => {
                console.log("GET USER: Got user document for " + username + ": " + user);
                resolve(user)
            }).catch(error => reject(error))
        );
    })
};

/**
 * @return {boolean}
 */
exports.CreateUser = function (username, displayName, password) {
    UsersCollection().then(collection => {
        if (collection.findOne({username: username}) === null) {
            console.log("Creating User: ", username, " with password: ", password);
            let passHash = crypto.encrypt(password);
            collection.insertOne({
                username: username,
                displayName: displayName,
                password: passHash
            });
            return true;
        }
        return false;
    });
};
