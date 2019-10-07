const low = require('lowdb');
const Memory = require('lowdb/adapters/Memory')
const FileSync = require('lowdb/adapters/FileSync');
const adapter = new FileSync('db.json');

const db = low(new Memory());

db.defaults({
    books: [{
      id: 1,
      name: 'Gone With The Wind',
      remain: 1,
      total: 2,
    }, {
      id: 2,
      name: 'Harry Potter',
      remain: 1,
      total: 1,
    }, {
      id: 3,
      name: 'Game Of Throne',
      remain: 2,
      total: 3,
    }],
    users: [{
      id: 1,
      name: 'Lily',
    }, {
      id: 2,
      name: 'Mark',
    }, {
      id: 3,
      name: 'Green',
    }],
    admin: {
      name: 'admin',
      password: 'admin',
    },
    borrowingList: [{
      id: 1,
      userId: 1,
      bookId: 1,
    }, {
      id: 2,
      userId: 3,
      bookId: 3,
    }],
})
  .write();

module.exports = db;
